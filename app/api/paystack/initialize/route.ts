import { randomUUID } from "crypto";
import { createOrder, recordTransaction } from "@/lib/admin-store";

type PaystackPayload = {
  email: string;
  amount: number;
  callbackUrl: string;
  metadata: Record<string, unknown>;
  customer?: {
    name: string;
    phone: string;
    city: string;
    state: string;
  };
  items?: { id?: string; name: string; price: string; amount: number; quantity: number }[];
};

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return Response.json(
      { error: "PAYSTACK_SECRET_KEY is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as PaystackPayload;

  if (!body.email || !body.amount || !body.callbackUrl) {
    return Response.json(
      { error: "Email, amount, and callback URL are required." },
      { status: 400 }
    );
  }

  const reference = `uche_${Date.now()}`;
  const order = await createOrder({
    customer: body.customer?.name || String(body.metadata.customer_name || "Customer"),
    email: body.email,
    phone: body.customer?.phone || String(body.metadata.phone || ""),
    product: (body.items || []).map((item) => item.name).join(", "),
    city: body.customer?.city || "",
    state: body.customer?.state || "",
    total: body.amount,
    reference,
    items: (body.items || []).map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      amount: item.amount,
      quantity: item.quantity,
    })),
    metadata: body.metadata,
  });

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      amount: Math.round(body.amount * 100),
      currency: "NGN",
      callback_url: body.callbackUrl,
      metadata: { ...body.metadata, order_id: order.id },
      reference,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    return Response.json(
      { error: data.message || "Unable to initialize Paystack payment." },
      { status: response.status || 502 }
    );
  }

  await recordTransaction({
    id: randomUUID(),
    orderId: order.id,
    reference,
    amount: body.amount,
    status: "initialized",
    customerEmail: body.email,
    payload: data,
  });

  return Response.json({ ...data.data, orderId: order.id });
}
