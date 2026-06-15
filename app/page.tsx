import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Footer, Header } from "@/components/site-shell";
import { products } from "@/lib/store";

const heroStats = [
  ["250+", "products ready to source"],
  ["Abuja", "delivery coordination"],
  ["Setup", "support after purchase"],
];

const heroDeviceImages = [
  {
    className: "tv-model",
    src: "/images/cutouts/tcl-tv-cutout.png",
    alt: "TCL television",
  },
  {
    className: "phone-model",
    src: "/images/cutouts/iphone-cutout.png",
    alt: "Apple iPhone",
  },
  {
    className: "speaker-model",
    src: "/images/cutouts/monitor-cutout.png",
    alt: "Gaming and work monitor",
  },
  {
    className: "appliance-model",
    src: "/images/cutouts/ipad-cutout.png",
    alt: "Purple iPad Air",
  },
];

const categoryHighlights = [
  {
    title: "Entertainment systems",
    text: "Televisions, soundbars, speakers, wall brackets, and viewing-room bundles.",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Home appliances",
    text: "Fridges, washers, cookers, microwaves, air conditioners, and essentials.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Mobile and work tech",
    text: "Phones, laptops, accessories, chargers, power backups, and desk gear.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=82",
  },
];

const promises = [
  [
    "Tell us the exact need",
    "Share the room, budget, brand preference, or appliance size you are looking for.",
  ],
  [
    "Confirm the right option",
    "Get stock, price, warranty, delivery cost, and suitable alternatives before payment.",
  ],
  [
    "Receive and set up",
    "Coordinate dispatch and setup support for televisions, washers, fridges, and smart devices.",
  ],
];

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="landing-wrap">
      <Header />
      <main className="landing-canvas landing-refresh">
        <section className="store-hero">
          <Image
            src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=86"
            alt="Modern home with smart electronics and appliances"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="store-hero-shade" />
          <div className="store-hero-content">
            <p className="store-kicker">Uche's Gadget Hub</p>
            <h1>Reliable gadgets and home appliances for everyday living.</h1>
            <div className="store-hero-actions">
              <p>
                Find televisions, phones, laptops, fridges, washers, kitchen
                appliances, sound systems, and accessories with clear pricing,
                product guidance, delivery, and setup support.
              </p>
              <div>
                <Link href="/shop" className="primary-btn">
                  Explore products
                </Link>
                <Link href="/contact" className="secondary-btn">
                  Request guidance
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-3d-stage" aria-hidden="true">
            <div className="device-orbit">
              {heroDeviceImages.map((item) => (
                <div className={item.className} key={item.src}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 720px) 10rem, 22rem"
                    className="hero-device-image"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-stat-bar">
            {heroStats.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section-head">
            <p className="eyebrow">Product categories</p>
            <h2>Everything you need for a working, comfortable home.</h2>
          </div>
          <div className="category-showcase">
            {categoryHighlights.map((item) => (
              <Link
                href="/shop"
                className="category-showcase-card"
                key={item.title}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <span />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section-head split">
            <div>
              <p className="eyebrow">Featured</p>
              <h2>Popular products customers ask for often.</h2>
            </div>
            <div>
              <Link href="/shop" className="secondary-btn">
                See full catalog
              </Link>
            </div>
          </div>
          <div className="featured-product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>

        <section className="support-band">
          <div className="support-image">
            <Image
              src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=82"
              alt="Customer receiving guided product support"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="support-copy">
            <p className="eyebrow">Order support</p>
            <h2>Simple buying for products that need the right advice.</h2>
            <p>
              For gadgets and appliances, the right model matters. We help you
              compare options, confirm availability, understand delivery, and
              arrange setup before you commit.
            </p>
            <div className="support-promises">
              {promises.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div className="request-copy">
            <p className="eyebrow">Abuja sourcing desk</p>

            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Send the product you want. We will help confirm the right option.
            </h2>

            <p className="mt-6 text-lg text-slate-600">
              Tell us the device, appliance, model, size, or budget you have in
              mind. The team can help with availability, current pricing,
              delivery planning, installation support, and better alternatives.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="primary-btn">
                Request a quote
              </Link>

              <Link href="/shop" className="secondary-btn">
                View products
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[400px]">
            <Image
              src="/images/cutouts/tcl-tv-cutout.png"
              alt=""
              width={360}
              height={240}
              className="request-tv"
            />

            <Image
              src="/images/cutouts/iphone-cutout.png"
              alt=""
              width={160}
              height={220}
              className="absolute bottom-0 left-8"
            />

            <Image
              src="/images/cutouts/ipad-cutout.png"
              alt=""
              width={220}
              height={180}
              className="absolute top-8 right-8"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
