"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const stats = [
  { label: "Total Orders", value: "24" },
  { label: "Pending Orders", value: "6" },
  { label: "Products", value: "38" },
  { label: "Revenue", value: "₦ 480,000" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Emeka Okafor", product: "Samsung 65\" TV", status: "Pending", date: "June 14, 2026" },
  { id: "ORD-002", customer: "Ngozi Adeyemi", product: "iPhone 15 Pro", status: "Delivered", date: "June 13, 2026" },
  { id: "ORD-003", customer: "Tunde Balogun", product: "LG Washing Machine", status: "Processing", date: "June 12, 2026" },
  { id: "ORD-004", customer: "Amaka Eze", product: "Sony Soundbar", status: "Pending", date: "June 11, 2026" },
];

const statusColors: Record<string, string> = {
  Pending: "admin-badge-pending",
  Processing: "admin-badge-processing",
  Delivered: "admin-badge-delivered",
  Cancelled: "admin-badge-cancelled",
};

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="brand-mark">UG</span>
          <div>
            <span className="site-logo-name">Uche's</span>
            <span className="site-logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          <Link href="/admin/dashboard" className="admin-nav-link is-active">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="admin-nav-link">
            Orders
          </Link>
          <Link href="/admin/products" className="admin-nav-link">
            Products
          </Link>
        </nav>

        <button onClick={handleLogout} className="admin-logout-btn">
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-sub">Welcome back — here's what's happening today.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-stat-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="admin-section">
          <div className="admin-section-head">
            <h2>Recent Orders</h2>
            <Link href="/admin/orders" className="admin-view-all">
              View all →
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="admin-order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td className="admin-muted">{order.date}</td>
                    <td>
                      <span className={`admin-badge ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}