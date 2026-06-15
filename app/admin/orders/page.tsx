"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialOrders = [
  { id: "ORD-001", customer: "Emeka Okafor", phone: "08012345678", product: "Samsung 65\" TV", city: "Lagos", state: "Lagos", status: "Pending", date: "June 14, 2026" },
  { id: "ORD-002", customer: "Ngozi Adeyemi", phone: "08087654321", product: "iPhone 15 Pro", city: "Abuja", state: "FCT - Abuja", status: "Delivered", date: "June 13, 2026" },
  { id: "ORD-003", customer: "Tunde Balogun", phone: "08023456789", product: "LG Washing Machine", city: "Ibadan", state: "Oyo", status: "Processing", date: "June 12, 2026" },
  { id: "ORD-004", customer: "Amaka Eze", phone: "08034567890", product: "Sony Soundbar", city: "Enugu", state: "Enugu", status: "Pending", date: "June 11, 2026" },
  { id: "ORD-005", customer: "Chidi Obi", phone: "08045678901", product: "Hisense Fridge", city: "Port Harcourt", state: "Rivers", status: "Cancelled", date: "June 10, 2026" },
];

const allStatuses = ["Pending", "Processing", "Delivered", "Cancelled"];

const statusColors: Record<string, string> = {
  Pending: "admin-badge-pending",
  Processing: "admin-badge-processing",
  Delivered: "admin-badge-delivered",
  Cancelled: "admin-badge-cancelled",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const updateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

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
          <Link href="/admin/dashboard" className="admin-nav-link">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="admin-nav-link is-active">
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
            <h1 className="admin-page-title">Orders</h1>
            <p className="admin-page-sub">Manage and update customer orders.</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="admin-filter-tabs">
          {["All", ...allStatuses].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`admin-filter-tab ${filter === s ? "is-active" : ""}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td className="admin-order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="admin-muted">{order.phone}</td>
                  <td>{order.product}</td>
                  <td className="admin-muted">{order.city}, {order.state}</td>
                  <td className="admin-muted">{order.date}</td>
                  <td>
                    <span className={`admin-badge ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="admin-status-select"
                    >
                      {allStatuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}