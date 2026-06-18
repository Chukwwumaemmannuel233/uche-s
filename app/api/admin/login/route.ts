import { findAdmin } from "@/lib/admin-store";
import { setAdminSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const admin = await findAdmin(email);
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setAdminSession(email);
  return Response.json({ ok: true });
}
