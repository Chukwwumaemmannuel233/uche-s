import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "uche_admin_session";

function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function hashPassword(password: string) {
  return hashSecret(`${process.env.ADMIN_PASSWORD_SALT || "local"}:${password}`);
}

export function verifyPassword(password: string, hash: string) {
  const incoming = Buffer.from(hashPassword(password));
  const stored = Buffer.from(hash);
  return incoming.length === stored.length && timingSafeEqual(incoming, stored);
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
