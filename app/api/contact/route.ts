import { createContactMessage, jsonError } from "@/lib/admin-store";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.phone || !body.requestType || !body.message) {
    return jsonError("Name, phone, request type, and message are required.");
  }

  return Response.json(
    await createContactMessage({
      name: body.name,
      phone: body.phone,
      requestType: body.requestType,
      product: body.product || "",
      message: body.message,
    }),
    { status: 201 }
  );
}
