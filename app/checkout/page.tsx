"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Header, Footer } from "@/components/site-shell";
import { useCart } from "@/components/cart-provider";
import type { Form } from "@/components/paystack-button";

const PaystackButton = dynamic(() => import("@/components/paystack-button"), {
  ssr: false,
  loading: () => (
    <button className="primary-btn checkout-submit-btn" disabled>
      Loading...
    </button>
  ),
});

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function CheckoutPage() {
  const { items: cartItems, count: totalItems } = useCart();
  const [form, setForm] = useState<Form>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const orderTotal = cartItems.reduce(
    (total, item) => total + item.amount * item.quantity,
    0
  );

  return (
    <div className="landing-wrap">
      <Header />

      <main className="checkout-page">
        {/* LEFT — Form */}
        <section className="checkout-form-section">
          <p className="eyebrow">Secure Checkout</p>
          <h1 className="page-title">Complete your order</h1>

          {/* Personal Info */}
          <div className="checkout-form-card">
            <p className="checkout-form-section-label">Personal Information</p>

            <div className="checkout-field-grid">
              <label className="checkout-label">
                <span>First Name *</span>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="checkout-input"
                />
              </label>
              <label className="checkout-label">
                <span>Last Name *</span>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="checkout-input"
                />
              </label>
            </div>

            <div className="checkout-field-grid">
              <label className="checkout-label">
                <span>Email Address *</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="checkout-input"
                />
              </label>
              <label className="checkout-label">
                <span>Phone Number *</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234..."
                  className="checkout-input"
                />
              </label>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="checkout-form-card">
            <p className="checkout-form-section-label">Delivery Address</p>

            <label className="checkout-label">
              <span>Street Address *</span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="12 Example Street, Flat 3"
                className="checkout-input"
              />
            </label>

            <div className="checkout-field-grid">
              <label className="checkout-label">
                <span>City *</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Lagos"
                  className="checkout-input"
                />
              </label>
              <label className="checkout-label">
                <span>State *</span>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="checkout-input"
                >
                  <option value="" disabled>Select state</option>
                  {nigerianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="checkout-field-grid">
              <label className="checkout-label">
                <span>Country *</span>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="checkout-input"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="checkout-label">
                <span>Postal Code (optional)</span>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="100001"
                  className="checkout-input"
                />
              </label>
            </div>

            <label className="checkout-label">
              <span>Additional Notes (optional)</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any special delivery instructions..."
                rows={3}
                className="checkout-input"
              />
            </label>
          </div>

          <PaystackButton amount={orderTotal} form={form} items={cartItems} />
        </section>

        {/* RIGHT — Order Summary */}
        <aside className="checkout-summary-card">
          <p className="checkout-form-section-label">Order Summary</p>

          <div className="checkout-summary-items">
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

          <div className="checkout-summary-totals">
            <div className="summary-line">
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <strong>To confirm</strong>
            </div>
            <div className="summary-line">
              <span>Total</span>
              <strong>NGN {new Intl.NumberFormat("en-NG").format(orderTotal)}</strong>
            </div>
          </div>

          <Link href="/cart" className="secondary-btn checkout-back-btn">
            Back to cart
          </Link>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
