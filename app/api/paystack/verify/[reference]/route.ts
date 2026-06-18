import { randomUUID } from "crypto";
import { recordTransaction, updateOrderStatus } from "@/lib/admin-store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ reference: string }> }
) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const { reference } = await context.params;

  if (!secretKey) {
    return Response.json(
      { error: "PAYSTACK_SECRET_KEY is not configured." },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );
  const data = await response.json();

  if (!response.ok || !data.status) {
    return Response.json(
      { error: data.message || "Unable to verify Paystack payment." },
      { status: response.status || 502 }
    );
  }

  const transaction = data.data;
  const orderId = transaction.metadata?.order_id;

  await recordTransaction({
    id: randomUUID(),
    orderId,
    reference,
    amount: Number(transaction.amount || 0) / 100,
    status: transaction.status,
    channel: transaction.channel,
    customerEmail: transaction.customer?.email,
    gatewayResponse: transaction.gateway_response,
    payload: transaction,
  });

  if (orderId && transaction.status === "success") {
    await updateOrderStatus(orderId, "Paid", "paid");
  }

  return Response.json(transaction);
}
