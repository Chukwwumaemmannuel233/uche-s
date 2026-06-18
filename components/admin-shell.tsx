"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  ReceiptText,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
];

export const adminStyles = {
  shell: "grid min-h-screen bg-[#f6f9fc] lg:grid-cols-[15rem_1fr]",
  sidebar:
    "sticky top-0 z-20 flex h-auto flex-wrap items-center gap-3 bg-[#101928] p-4 text-white lg:h-screen lg:flex-col lg:items-stretch lg:gap-0 lg:p-5",
  logo: "flex items-center gap-3 lg:mb-10",
  nav: "flex flex-1 gap-1 overflow-x-auto lg:grid lg:content-start lg:gap-1",
  navLink:
    "inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-extrabold text-white/65 transition hover:bg-white/10 hover:text-white",
  navLinkActive: "bg-white/15 text-white",
  logout:
    "inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-sm font-extrabold text-white/65 transition hover:bg-white/10 hover:text-white lg:mt-auto",
  main: "grid content-start gap-7 p-5 sm:p-7 lg:p-10",
  topbar: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
  title: "text-2xl font-black text-[#111827]",
  sub: "mt-1 text-sm text-[#536476]",
  card: "border border-[#d8e0ea] bg-white p-5",
  tableWrap: "overflow-x-auto border border-[#d8e0ea] bg-white",
  table: "w-full border-collapse text-left",
  th: "border-b border-[#d8e0ea] bg-[#f6f9fc] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#536476] whitespace-nowrap",
  td: "border-b border-[#d8e0ea] px-4 py-4 text-sm text-[#111827] last:border-b-0",
  input:
    "min-h-12 w-full border border-[#d8e0ea] bg-white px-4 py-3 text-sm font-bold text-[#111827] outline-none transition placeholder:text-[#8a98a8] focus:border-[#1273c4] focus:ring-4 focus:ring-[#1273c4]/10",
  primary:
    "inline-flex min-h-12 items-center justify-center gap-2 bg-[#1273c4] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0a4f8f] disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex min-h-12 items-center justify-center gap-2 border border-[#d8e0ea] bg-white px-5 py-3 text-sm font-black text-[#111827] transition hover:border-[#1273c4] hover:text-[#0a4f8f]",
  danger:
    "inline-flex min-h-12 items-center justify-center gap-2 bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700",
};

export function AdminShell({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/admin");
  };

  return (
    <div className={adminStyles.shell}>
      <aside className={adminStyles.sidebar}>
        <div className={adminStyles.logo}>
          <span className="brand-mark">UG</span>
          <div>
            <span className="block text-sm font-black uppercase tracking-[0.16em] text-white">
              Uche&apos;s
            </span>
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className={adminStyles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                className={`${adminStyles.navLink} ${
                  active === item.href ? adminStyles.navLinkActive : ""
                }`}
                key={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className={adminStyles.logout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </aside>

      <main className={adminStyles.main}>{children}</main>
    </div>
  );
}

export function statusClass(status: string) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Processing: "bg-blue-50 text-blue-700",
    Delivered: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return `inline-flex px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${
    styles[status] || "bg-slate-100 text-slate-700"
  }`;
}
