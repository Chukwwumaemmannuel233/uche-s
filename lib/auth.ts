import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "uche_admin_session";

function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const pepper = process.env.ADMIN_PASSWORD_PEPPER || process.env.ADMIN_PASSWORD_SALT || "";
  const hash = scryptSync(`${password}:${pepper}`, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, hash: string) {
  if (hash.startsWith("scrypt$")) {
    const [, salt, storedHash] = hash.split("$");
    const pepper = process.env.ADMIN_PASSWORD_PEPPER || process.env.ADMIN_PASSWORD_SALT || "";
    const incoming = Buffer.from(
      scryptSync(`${password}:${pepper}`, salt, 64).toString("hex")
    );
    const stored = Buffer.from(storedHash);
    return incoming.length === stored.length && timingSafeEqual(incoming, stored);
  }

  const legacy = Buffer.from(
    hashSecret(`${process.env.ADMIN_PASSWORD_SALT || "local"}:${password}`)
  );
  const stored = Buffer.from(hash);
  return legacy.length === stored.length && timingSafeEqual(legacy, stored);
}

export function createSessionValue(email: string) {
  const nonce = randomBytes(16).toString("hex");
  const payload = Buffer.from(JSON.stringify({ email, nonce })).toString("base64url");
  const signature = hashSecret(`${payload}:${process.env.AUTH_SECRET || "dev-secret"}`);
  return `${payload}.${signature}`;
}

export function readSessionValue(value?: string) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = hashSecret(`${payload}:${process.env.AUTH_SECRET || "dev-secret"}`);
  if (expected !== signature) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email: string;
    };
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return readSessionValue(cookieStore.get(cookieName)?.value);
}
