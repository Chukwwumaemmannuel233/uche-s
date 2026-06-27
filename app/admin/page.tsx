"use client";

import { useState } from "react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminStyles } from "@/components/admin-shell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await response.text();
      let data: { error?: string } = {};
      if (text) {
        try {
          data = JSON.parse(text) as { error?: string };
        } catch {
          data = { error: "Login failed." };
        }
      }
      if (!response.ok) throw new Error(data.error || "Login failed.");

      toast.success("Welcome back");
      router.push("/admin/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid admin credentials";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f9fc] p-6">
      <section className="grid w-full max-w-md gap-7 border border-[#d8e0ea] bg-white p-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Uche's Gadget Hub"
            width={55}
            height={55}
            priority
          />
          <div>
            <span className="block text-sm font-black uppercase tracking-[0.16em] text-[#111827]">
              Uche&apos;s
            </span>
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#1273c4]">
              Gadget Hub
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#111827]">Admin Login</h1>
          <p className="mt-1 text-sm text-[#536476]">
            Sign in to manage your store.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-[#536476]">
              Email Address
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className={adminStyles.input}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-[#536476]">
              Password
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className={adminStyles.input}
            />
          </label>

          {error ? (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          ) : null}

          <button onClick={handleLogin} className={adminStyles.primary}>
            Sign In
          </button>
        </div>
      </section>
    </main>
  );
}
