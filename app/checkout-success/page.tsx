"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/site-shell";
import { products } from "@/lib/store";

const cartItems = products.slice(0, 3).map((product) => ({
  ...product,
  quantity: 1,
}));

function SuccessContent() {
  const params = useSearchParams();
  const firstName = params.get("firstName") || "Customer";
  const phone = params.get("phone") || "";
  const city = params.get("city") || "";
  const state = params.get("state") || "";

  return (
    <main className="checkout-success">
      <div className="checkout-success-card">

        {/* Animated checkmark */}
        <div className="checkout-success-icon">
          <svg viewBox="0 0 52 52" className="checkout-checkmark">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" />
            <path className="checkmark-tick" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <p className="eyebrow">Payment Successful</p>
        <h1>Thank you, {firstName}!</h1>
        <p className="checkout-success-copy">
          Your order has been confirmed and payment received. Our team will
          contact you shortly on <strong>{phone}</strong> to arrange delivery
          {city && state ? ` to ${city}, ${state}` : ""}.
        </p>

        {/* Items ordered */}
        <div className="checkout-success-items">
          <p className="checkout-form-section-label">Items Ordered</p>
          {cartItems.map((item) => (
            <div key={item.name} className="checkout-summary-row">
              <div>
                <p className="checkout-summary-name">{item.name}</p>
                <p className="checkout-summary-cat">{item.category}</p>
              </div>
              <div className="checkout-summary-right">
                <span className="checkout-summary-qty">x{item.quantity}</span>
                <strong className="checkout-summary-price">{item.price}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-success-actions">
          <Link href="/shop" className="primary-btn">
            Continue Shopping
          </Link>
          <Link href="/" className="secondary-btn">
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="landing-wrap">
      <Header />
      <Suspense fallback={<div className="checkout-success" />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}