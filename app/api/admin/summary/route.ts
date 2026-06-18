import { listOrders, listProducts } from "@/lib/admin-store";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  if (!(await getAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const pending = orders.filter((order) => order.status === "Pending").length;
  const revenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return Response.json({
    totalOrders: orders.length,
    pendingOrders: pending,
    products: products.length,
    revenue,
    recentOrders: orders.slice(0, 4),
  });
}
