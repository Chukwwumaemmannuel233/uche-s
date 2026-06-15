import Link from "next/link";
import { Footer, Header } from "@/components/site-shell";

const contactMethods = [
  ["Call sales", "+234 800 555 0199", "Speak with the team about stock, prices, and delivery."],
  ["WhatsApp", "+234 800 555 0199", "Send product photos, model names, or a shopping list."],
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
            <Link href="tel:+2348005550199" className="primary-btn">
              Call sales
            </Link>
          </div>
        </section>

        <section className="contact-main-grid">
          <form className="contact-form contact-request-form">
            <div>
              <p className="eyebrow">Request form</p>
              <h2>Get product help</h2>
            </div>

            <div className="contact-field-grid">
              <label>
                <span>Full name</span>
                <input placeholder="Your name" />
              </label>
              <label>
                <span>Phone number</span>
                <input placeholder="+234..." />
              </label>
            </div>

            <label>
              <span>What do you need?</span>
              <select defaultValue="">
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
              <input placeholder="Example: 65 inch TV under NGN 1.2m" />
            </label>

            <label>
              <span>Message</span>
              <textarea
                placeholder="Tell us the brand, model, size, delivery location, or installation need."
                rows={6}
              />
            </label>

            <button type="button">Send request</button>
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
      {/* <Footer /> */}
    </div>
  );
}
