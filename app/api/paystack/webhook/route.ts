import { createHmac, randomUUID } from "crypto";
import { recordAuditLog, recordTransaction, updateOrderStatus } from "@/lib/admin-store";

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return Response.json({ error: "PAYSTACK_SECRET_KEY is not configured." }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");

  if (signature !== expected) {
    return Response.json({ error: "Invalid Paystack signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const data = event.data || {};
  const orderId = data.metadata?.order_id;

  await recordTransaction({
    id: randomUUID(),
    orderId,
    reference: data.reference,
    amount: Number(data.amount || 0) / 100,
    status: data.status || event.event,
    channel: data.channel,
    customerEmail: data.customer?.email,
    gatewayResponse: data.gateway_response,
    payload: event,
  });

  if (event.event === "charge.success" && orderId) {
    await updateOrderStatus(orderId, "Paid", "paid");
    await recordAuditLog({
      actor: "paystack",
      action: "payment.confirmed",
      entity: "order",
      entityId: orderId,
      metadata: { reference: data.reference },
    });
  }

  return Response.json({ received: true });
}
