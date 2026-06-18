"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },              
  { href: "/services", label: "Services" },              
];

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.7 12.7a2 2 0 0 0 2 1.6h8.95a2 2 0 0 0 1.95-1.57L21 8H5.12" />
    </svg>
  );
}

export function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="brand-mark">UG</span>

          <div>
            <span className="block text-sm font-black uppercase tracking-[0.16em] text-[#0f172a]">
              Uche&apos;s
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#1273c4]">
              Gadget Hub
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#536476] transition hover:text-[#1273c4]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* <Link
            href="/contact"
            className="hidden sm:inline-flex rounded-full bg-[#1273c4] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Request Quote
          </Link> */}

          <Link
            href="/cart"
            className="relative flex items-center justify-center"
            aria-label="View cart"
          >
            <CartIcon />

            {count > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
      <nav
        aria-label="Mobile navigation"
        className="flex gap-1 overflow-x-auto border-t border-[#e5edf5] px-4 py-2 md:hidden"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#536476]"
          >
            {item.label}
          </Link>
        ))}
        {/* <Link
          href="/services"
          className="shrink-0 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#536476]"
        >
          Services
        </Link> */}
      </nav>
    </header>
  );
}

export function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348005550199";
  const message = encodeURIComponent(
    "Hello Uche's Gadget Hub, I need help with a product."
  );

  return (
    <a
      aria-label="Chat with Uche's Gadget Hub on WhatsApp"
      href={`https://wa.me/${phone}?text=${message}`}
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105"
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
   <footer className="bg-[#0f172a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="brand-mark">UG</span>
              <h3 className="font-bold">Uche&apos;s Gadget Hub</h3>
            </div>

            <p className="text-sm text-slate-300">
              Abuja-based sourcing, delivery, and setup support for gadgets,
              electronics, and home appliances.
            </p>

            <Link
              href="/contact"
              className="mt-4 inline-block rounded-lg bg-[#1273c4] px-4 py-2 text-sm font-semibold"
            >
              Request Product Help
            </Link>
          </div>

          {/* Store */}
          <div>
            <h4 className="mb-4 font-semibold">Store</h4>

            <div className="flex flex-col gap-2 text-slate-300">
              <Link href="/shop">Products</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact Sales</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>

            <div className="flex flex-col gap-2 text-slate-300">
              <span>Product sourcing</span>
              <span>Delivery coordination</span>
              <span>Installation guidance</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Abuja</h4>

            <div className="flex flex-col gap-2 text-slate-300">
              <span>Abuja showroom</span>
              <span>Mon - Sat, 9:00 - 18:00</span>
              <span>+234 800 555 0199</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:justify-between">
          <span>© {year} Uche&apos;s Gadget Hub</span>
          <span>Gadgets, appliances, delivery, and setup support.</span>
        </div>
      </div>
    </footer>
  );
}
