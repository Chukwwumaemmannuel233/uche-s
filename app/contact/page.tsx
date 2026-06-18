"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site-shell";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348005550199";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello Uche's Gadget Hub, I need product help."
)}`;

const contactMethods = [
  ["WhatsApp sales", "+234 800 555 0199", "Speak with the team about stock, prices, and delivery."],
  ["Product photos", "+234 800 555 0199", "Send product photos, model names, or a shopping list."],
  ["Showroom", "Abuja showroom", "Visit Monday to Saturday, 9:00 - 18:00."],
];

const requestTypes = [
  "Product availability",
  "Delivery and installation",
  "Bulk or office purchase",
  "Warranty or after-sales help",
];

const nextSteps = [
  "We confirm the product, model, size, and budget.",
  "You receive stock, price, warranty, and delivery details.",
  "The team coordinates payment, dispatch, and setup support.",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    requestType: "",
    product: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const updateForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Request sent. The admin team can now see it.");
      setForm({ name: "", phone: "", requestType: "", product: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-wrap">
      <Header />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-copy">
            <p className="eyebrow">Contact sales</p>
            <h1>Tell us what you need. We will help confirm the right option.</h1>
            <p>
              Ask about current stock, product alternatives, delivery fees,
              installation support, warranty help, or bulk buying for homes,
              offices, and short-let spaces.
            </p>
          </div>

          <div className="contact-direct-card">
            <span>Fastest response</span>
            <strong>Send the product name, size, brand, or photo.</strong>
            <p>
              The team can reply with availability, price, delivery timing, and
              suitable alternatives before you pay.
            </p>
            <Link href={whatsappUrl} className="primary-btn" target="_blank">
              Chat on WhatsApp
            </Link>
          </div>
        </section>

        <section className="contact-main-grid">
          <form className="contact-form contact-request-form" onSubmit={submitForm}>
            <div>
              <p className="eyebrow">Request form</p>
              <h2>Get product help</h2>
            </div>

            <div className="contact-field-grid">
              <label>
                <span>Full name</span>
                <input
                  name="name"
                  onChange={updateForm}
                  placeholder="Your name"
                  value={form.name}
                />
              </label>
              <label>
                <span>Phone number</span>
                <input
                  name="phone"
                  onChange={updateForm}
                  placeholder="+234..."
                  value={form.phone}
                />
              </label>
            </div>

            <label>
              <span>What do you need?</span>
              <select
                name="requestType"
                onChange={updateForm}
                value={form.requestType}
              >
                <option value="" disabled>
                  Select request type
                </option>
                {requestTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Product or budget</span>
              <input
                name="product"
                onChange={updateForm}
                placeholder="Example: 65 inch TV under NGN 1.2m"
                value={form.product}
              />
            </label>

            <label>
              <span>Message</span>
              <textarea
                name="message"
                onChange={updateForm}
                placeholder="Tell us the brand, model, size, delivery location, or installation need."
                rows={6}
                value={form.message}
              />
            </label>

            <button disabled={loading} type="submit">
              {loading ? "Sending..." : "Send request"}
            </button>
          </form>

          <aside className="contact-side-panel">
            <div className="contact-methods">
              {contactMethods.map(([title, value, text]) => (
                <article key={title}>
                  <span>{title}</span>
                  <strong>{value}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>

            <div className="contact-next-steps">
              <p className="eyebrow">What happens next</p>
              {nextSteps.map((step, index) => (
                <article key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
