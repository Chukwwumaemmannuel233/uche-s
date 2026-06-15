import Image from "next/image";

export function Showcase3D() {
  return (
    <div className="showcase-stage" aria-label="Premium home appliance display">
      <Image
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=82"
        alt="Modern living room with premium home technology"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="showcase-overlay" />
      <div className="hero-console">
        <span>Home upgrade</span>
        <strong>Curated appliance bundle</strong>
      </div>
      <div className="floating-chip chip-one">OLED TV</div>
      <div className="floating-chip chip-two">Kitchen tech</div>
    </div>
  );
}
