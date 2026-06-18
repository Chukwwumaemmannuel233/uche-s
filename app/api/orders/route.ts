import { createOrder, listOrders } from "@/lib/admin-store";
import type { Order } from "@/lib/orders";

export async function GET() {
  return Response.json(await listOrders());
}

export async function POST(request: Request) {
  const order = (await request.json()) as Omit<Order, "id" | "date" | "status">;
  return Response.json(await createOrder(order), { status: 201 });
}
