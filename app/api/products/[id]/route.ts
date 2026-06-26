import {
  deleteProduct,
  getProduct,
  jsonError,
  recordAuditLog,
  upsertProduct,
} from "@/lib/admin-store";
import { getAdminSession } from "@/lib/auth";
import type { Product } from "@/lib/store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;
  const updates = (await request.json()) as Partial<Product>;
  const product = await getProduct(id);

  if (!product) {
    return jsonError("Product not found.", 404);
  }

  const nextProduct = {
    ...product,
    ...updates,
    amount:
      typeof updates.amount === "number"
        ? updates.amount
        : Number(String(updates.price || product.price).replace(/[^\d]/g, "")),
  };

  const updated = await upsertProduct(nextProduct);
  await recordAuditLog({
    actor: "admin",
    action: "product.updated",
    entity: "product",
    entityId: updated.id,
    metadata: { name: updated.name },
  });
  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;
  const deleted = await deleteProduct(id);
  if (!deleted) {
    return jsonError("Product not found.", 404);
  }
  await recordAuditLog({
    actor: "admin",
    action: "product.deleted",
    entity: "product",
    entityId: id,
  });
  return Response.json({ ok: true });
}
