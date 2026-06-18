"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell, adminStyles, statusClass } from "@/components/admin-shell";
import type { Order } from "@/lib/orders";

type Summary = {
  totalOrders: number;
  pendingOrders: number;
  products: number;
  revenue: number;
  recentOrders: Order[];
};

const emptySummary: Summary = {
  totalOrders: 0,
  pendingOrders: 0,
  products: 0,
  revenue: 0,
  recentOrders: [],
};

function formatNaira(value: number) {
  return `NGN ${new Intl.NumberFormat("en-NG").format(value)}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const auth = await fetch("/api/admin/me");
      const authData = await auth.json();
      if (!authData.admin) {
        router.push("/admin");
        return;
      }

      fetch("/api/admin/summary")
        .then((response) => response.json())
        .then(setSummary)
        .catch(() => toast.error("Could not load admin summary"))
        .finally(() => setLoading(false));
    }

    loadDashboard();
  }, [router]);

  const stats = [
    { label: "Total Orders", value: summary.totalOrders },
    { label: "Pending Orders", value: summary.pendingOrders },
    { label: "Products", value: summary.products },
    { label: "Revenue", value: formatNaira(summary.revenue) },
  ];

  return (
    <AdminShell active="/admin/dashboard">
      <div className={adminStyles.topbar}>
        <div>
          <h1 className={adminStyles.title}>Dashboard</h1>
          <p className={adminStyles.sub}>Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={adminStyles.card}>
            <span className="text-xs font-black uppercase tracking-[0.12em] text-[#536476]">
              {stat.label}
            </span>
            <strong className="mt-3 block text-3xl font-black text-[#111827]">
              {loading ? "..." : stat.value}
            </strong>
          </div>
        ))}
      </div>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#111827]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-black text-[#1273c4]">
            View all
          </Link>
        </div>

        <div className={adminStyles.tableWrap}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Product", "Date", "Status"].map(
                  (heading) => (
                    <th key={heading} className={adminStyles.th}>
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className={adminStyles.td} colSpan={5}>
                    Loading recent orders...
                  </td>
                </tr>
              ) : (
                summary.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className={`${adminStyles.td} font-black text-[#1273c4]`}>
                      {order.id}
                    </td>
                    <td className={adminStyles.td}>{order.customer}</td>
                    <td className={adminStyles.td}>{order.product}</td>
                    <td className={adminStyles.td}>{order.date}</td>
                    <td className={adminStyles.td}>
                      <span className={statusClass(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
