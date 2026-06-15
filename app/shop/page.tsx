import { ShopCatalog } from "@/components/shop-catalog";
import { Footer, Header } from "@/components/site-shell";
import { categories, products } from "@/lib/store";

export default function ShopPage() {
  return (
    <div className="landing-wrap">
      <Header />
      <main className="shop-simple-page">
        <ShopCatalog categories={categories} products={products} />
      </main>
      <Footer />
    </div>
  );
}
