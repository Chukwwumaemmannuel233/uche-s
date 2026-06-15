"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products as initialProducts } from "@/lib/store";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const removeProduct = (name: string) => {
    setProducts((prev) => prev.filter((p) => p.name !== name));
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
          <Link href="/admin/dashboard" className="admin-nav-link">
            Dashboard
          </Link>
          <Link href="/admin/orders" className="admin-nav-link">
            Orders
          </Link>
          <Link href="/admin/products" className="admin-nav-link is-active">
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
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-sub">View and manage your product catalogue.</p>
          </div>
          <button className="primary-btn">+ Add Product</button>
        </div>

        {/* Search */}
        <div className="admin-search-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="checkout-input admin-search"
          />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.name}>
                  <td className="admin-product-name">{product.name}</td>
                  <td className="admin-muted">{product.category}</td>
                  <td className="admin-product-price">{product.price}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-edit">Edit</button>
                      <button
                        onClick={() => removeProduct(product.name)}
                        className="admin-action-delete"
                      >
                        Delete
                      </button>
                    </div>
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