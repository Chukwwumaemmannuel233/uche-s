import { randomUUID } from "crypto";
import { createOrder, recordTransaction } from "@/lib/admin-store";
import { isEmail, rateLimitRequest, safeError, sanitizeEmail, sanitizeText } from "@/lib/security";

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
  const limited = await rateLimitRequest("paystack-initialize", 20, 60_000);
  if (limited) return limited;

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return Response.json(
      { error: "PAYSTACK_SECRET_KEY is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as PaystackPayload;
  const email = sanitizeEmail(body.email);

  if (!email || !isEmail(email) || !body.amount || !body.callbackUrl) {
    return safeError("Valid email, amount, and callback URL are required.", 400);
  }

  const reference = `uche_${Date.now()}`;
  const order = await createOrder({
    customer: sanitizeText(body.customer?.name || body.metadata.customer_name || "Customer", 120),
    email,
    phone: sanitizeText(body.customer?.phone || body.metadata.phone || "", 40),
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
      email,
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
    customerEmail: email,
    payload: data,
  });

  return Response.json({ ...data.data, orderId: order.id });
}
