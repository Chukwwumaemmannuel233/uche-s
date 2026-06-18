import { ShopCatalog } from "@/components/shop-catalog";
import { Footer, Header } from "@/components/site-shell";
import { categories } from "@/lib/store";
import { listProducts } from "@/lib/admin-store";

export default async function ShopPage() {
  const products = await listProducts();

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
