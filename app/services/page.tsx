import { Footer, Header } from "@/components/site-shell";
import { services } from "@/lib/store";

export default function ServicesPage() {
  return (
    <div className="landing-wrap">
      <Header />
      <main className="landing-canvas inner-canvas">
        <p className="eyebrow">Services</p>
        <h1 className="page-title">
          Delivery, installation, and warranty help after checkout.
        </h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <article className="service-panel" key={service}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{service}</h2>
              <p>
                Our team coordinates purchase confirmation, dispatch, setup,
                and follow-up so the customer gets a finished experience.
              </p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
