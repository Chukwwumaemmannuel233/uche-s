import { jsonError, recordAuditLog, updateOrderStatus } from "@/lib/admin-store";
import { getAdminSession } from "@/lib/auth";
import { orderStatuses } from "@/lib/orders";
import type { OrderStatus } from "@/lib/orders";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;
  const { status } = (await request.json()) as { status?: OrderStatus };

  if (!status || !orderStatuses.includes(status)) {
    return jsonError("Valid order status is required.");
  }

  const updated = await updateOrderStatus(id, status);
  if (!updated) {
    return jsonError("Order not found.", 404);
  }

  await recordAuditLog({
    actor: "admin",
    action: "order.status_updated",
    entity: "order",
    entityId: id,
    metadata: { status },
  });
  return Response.json(updated);
}
