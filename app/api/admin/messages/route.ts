import { getAdminSession } from "@/lib/auth";
import { listContactMessages } from "@/lib/admin-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(await listContactMessages());
}
