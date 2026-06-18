import Image from "next/image";
import Link from "next/link";
import { Footer, Header } from "@/components/site-shell";

const stats = [
  ["Abuja", "local product support"],
  ["250+", "gadgets and appliances"],
  ["Setup", "delivery and installation guidance"],
];

const principles = [
  {
    title: "Practical product guidance",
    text: "We help customers choose products by use case, room size, budget, warranty needs, and available stock.",
  },
  {
    title: "Clear purchase process",
    text: "Customers can browse, ask questions, build a simple cart, and contact sales without a forced login flow.",
  },
  {
    title: "Support after selection",
    text: "The store is designed around delivery coordination, setup guidance, and follow-up for high-value purchases.",
  },
];

const categories = [
  "Televisions and sound systems",
  "Phones, tablets, and laptops",
  "Fridges, washers, and kitchen appliances",
  "Accessories, chargers, and smart home devices",
];

export default function AboutPage() {
  return (
    <div className="landing-wrap">
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-copy">
            <p className="eyebrow">About Uche&apos;s Gadget Hub</p>
            <h1>Abuja-based gadget and appliance support for everyday buyers.</h1>
            <p>
              Uche&apos;s Gadget Hub helps customers source reliable electronics,
              home appliances, accessories, and setup support without turning a
              simple purchase into a confusing process.
            </p>
            <div className="about-actions">
              <Link href="/shop" className="primary-btn">
                Browse products
              </Link>
              <Link href="/contact" className="secondary-btn">
                Ask for help
              </Link>
            </div>
          </div>

          <div className="about-product-stage" aria-hidden="true">
            <Image
              src="/images/cutouts/tcl-tv-cutout.png"
              alt=""
              width={430}
              height={290}
              className="about-tv"
            />
            <Image
              src="/images/cutouts/iphone-cutout.png"
              alt=""
              width={145}
              height={210}
              className="about-phone"
            />
            <Image
              src="/images/cutouts/ipad-cutout.png"
              alt=""
              width={220}
              height={180}
              className="about-tablet"
            />
          </div>
        </section>

        <section className="about-stat-strip">
          {stats.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        <section className="about-story">
          <div>
            <p className="eyebrow">What we do</p>
            <h2>We make gadget and appliance buying easier to confirm.</h2>
          </div>
          <div>
            <p>
              The site is built for customers who already know what they want,
              and for customers who only know the problem they are trying to
              solve: a bigger TV, a reliable fridge, a work laptop, a phone
              upgrade, or appliances for a home, office, or short-let space.
            </p>
            <p>
              Instead of pushing customers through a noisy checkout flow, the
              experience keeps the path direct: browse products, compare likely
              options, request confirmation, then coordinate delivery and setup
              with the team.
            </p>
          </div>
        </section>

        <section className="about-principles">
          {principles.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="about-category-band">
          <div>
            <p className="eyebrow">Product focus</p>
            <h2>Built around the items people use every day.</h2>
          </div>
          <div className="about-category-list">
            {categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
