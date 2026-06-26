import { findAdmin } from "@/lib/admin-store";
import { setAdminSession, verifyPassword } from "@/lib/auth";
import {
  rateLimitRequest,
  recordSecurityEvent,
  safeError,
  safeJson,
  sanitizeEmail,
  sanitizeText,
} from "@/lib/security";

export async function POST(request: Request) {
  const limited = await rateLimitRequest("admin-login", 5, 60_000);
  if (limited) return limited;

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return safeError("Invalid login request.", 400);
  }

  const { email: rawEmail, password: rawPassword } = body;
  const email = sanitizeEmail(rawEmail);
  const password = sanitizeText(rawPassword, 200);

  if (!email || !password) {
    return safeError("Email and password are required.", 400);
  }

  const admin = await findAdmin(email);
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    await recordSecurityEvent("admin_login_failed", { email });
    return safeError("Invalid email or password.", 401);
  }

  await setAdminSession(email);
  await recordSecurityEvent("admin_login_success", { email });
  return safeJson({ ok: true });
}
