import { createContactMessage, jsonError, recordAuditLog } from "@/lib/admin-store";
import {
  logServerError,
  rateLimitRequest,
  safeError,
  sanitizeText,
} from "@/lib/security";

export async function POST(request: Request) {
  const limited = await rateLimitRequest("contact", 10, 60_000);
  if (limited) return limited;

  try {
    const body = await request.json();
    const name = sanitizeText(body.name, 80);
    const phone = sanitizeText(body.phone, 40);
    const requestType = sanitizeText(body.requestType, 80);
    const product = sanitizeText(body.product, 160);
    const message = sanitizeText(body.message, 1200);

    if (!name || !phone || !requestType || !message) {
      return jsonError("Name, phone, request type, and message are required.");
    }

    const created = await createContactMessage({ name, phone, requestType, product, message });
    await recordAuditLog({
      actor: "customer",
      action: "contact.submitted",
      entity: "contact_message",
      entityId: created.id,
      metadata: { requestType },
    });
    return Response.json(created, { status: 201 });
  } catch (error) {
    logServerError("contact", error);
    return safeError("Message could not be sent.", 500);
  }
}
