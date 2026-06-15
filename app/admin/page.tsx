"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@uchesgadgethub.com";
const ADMIN_PASSWORD = "admin1234"; // change this to something strong

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = () => {
    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="brand-mark">UG</span>
          <div>
            <span className="site-logo-name">Uche's</span>
            <span className="site-logo-sub">Gadget Hub</span>
          </div>
        </div>

        <div className="admin-login-head">
          <h1>Admin Login</h1>
          <p>Sign in to manage your store</p>
        </div>

        <div className="admin-login-form">
          <label className="checkout-label">
            <span>Email Address</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="checkout-input"
            />
          </label>

          <label className="checkout-label">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="checkout-input"
            />
          </label>

          {error && <p className="admin-login-error">{error}</p>}

          <button onClick={handleLogin} className="primary-btn admin-login-btn">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}