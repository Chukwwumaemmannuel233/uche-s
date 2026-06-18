"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell, adminStyles, statusClass } from "@/components/admin-shell";
import { orderStatuses } from "@/lib/orders";
import type { Order, OrderStatus } from "@/lib/orders";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const auth = await fetch("/api/admin/me");
      const authData = await auth.json();
      if (!authData.admin) {
        router.push("/admin");
        return;
      }

      fetch("/api/orders")
        .then((response) => response.json())
        .then(setOrders)
        .catch(() => toast.error("Could not load orders"))
        .finally(() => setLoading(false));
    }

    loadOrders();
  }, [router]);

  const filtered = useMemo(
    () => (filter === "All" ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders]
  );

  const updateStatus = async (id: string, status: OrderStatus) => {
    const previous = orders;
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast.success(`Order ${id} moved to ${status}`);
    } catch (error) {
      setOrders(previous);
      toast.error(error instanceof Error ? error.message : "Could not update order");
    }
  };

  return (
    <AdminShell active="/admin/orders">
      <div className={adminStyles.topbar}>
        <div>
          <h1 className={adminStyles.title}>Orders</h1>
          <p className={adminStyles.sub}>Manage and update customer orders.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...orderStatuses].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as OrderStatus | "All")}
            className={`border px-4 py-2 text-sm font-black transition ${
              filter === status
                ? "border-[#1273c4] bg-[#1273c4] text-white"
                : "border-[#d8e0ea] bg-white text-[#536476] hover:border-[#1273c4] hover:text-[#1273c4]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className={adminStyles.tableWrap}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              {[
                "Order ID",
                "Customer",
                "Phone",
                "Product",
                "Location",
                "Date",
                "Status",
                "Update",
              ].map((heading) => (
                <th key={heading} className={adminStyles.th}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className={adminStyles.td} colSpan={8}>
                  Loading orders...
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className={`${adminStyles.td} font-black text-[#1273c4]`}>
                    {order.id}
                  </td>
                  <td className={adminStyles.td}>
                    <p className="font-black">{order.customer}</p>
                    <p className="mt-1 text-xs font-bold text-[#536476]">
                      {order.email}
                    </p>
                  </td>
                  <td className={adminStyles.td}>{order.phone}</td>
                  <td className={adminStyles.td}>{order.product}</td>
                  <td className={adminStyles.td}>
                    {order.city}, {order.state}
                  </td>
                  <td className={adminStyles.td}>{order.date}</td>
                  <td className={adminStyles.td}>
                    <span className={statusClass(order.status)}>{order.status}</span>
                  </td>
                  <td className={adminStyles.td}>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value as OrderStatus)
                      }
                      className="border border-[#d8e0ea] bg-white px-3 py-2 text-sm font-bold text-[#111827] outline-none focus:border-[#1273c4]"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
