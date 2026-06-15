"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/store";

type ShopCatalogProps = {
  categories: string[];
  products: Product[];
};

const allCategory = "All";
const allowedTags = new Set([
  "New arrival",
  "Best seller",
  "Out of stock",
  "Low stock",
]);

function getTagClassName(tag: string) {
  return `product-tag product-tag-${tag.toLowerCase().replaceAll(" ", "-")}`;
}

export function ShopCatalog({ categories, products }: ShopCatalogProps) {
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === allCategory ||
        product.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        product.name.toLowerCase().includes(activeCategory.toLowerCase());

      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.detail.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, query]);

  return (
    <>
      <section className="shop-simple-head">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Shop appliances, electronics, and gadgets.</h1>
          <p>
            Browse available picks, filter by category, or search for the
            product you need. You can confirm stock and delivery before payment.
          </p>
        </div>

        <label className="shop-search">
          <span>Find products</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search phones, TVs, fridges..."
            type="search"
            value={query}
          />
        </label>
      </section>

      <section className="shop-simple-tools">
        <div className="shop-category-panel">
          <span>Categories</span>
          <div className="shop-tabs" aria-label="Product categories">
            {[allCategory, ...categories].map((category) => (
              <button
                aria-pressed={activeCategory === category}
                className={activeCategory === category ? "is-active" : ""}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="shop-simple-grid">
        {filteredProducts.map((product) => (
          <article className="product-card group" key={product.name}>
            <div className="product-media">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              {allowedTags.has(product.tag) ? (
                <span className={getTagClassName(product.tag)}>
                  {product.tag}
                </span>
              ) : null}
            </div>
            <div className="mt-5 flex items-start justify-between gap-5">
              <div>
                <p className="product-category">{product.category}</p>
                <h3 className="mt-2 text-lg font-black leading-tight text-[#111827]">
                  {product.name}
                </h3>
              </div>
              <p className="shrink-0 text-base font-black text-[#1273c4]">
                {product.price}
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#536476]">
              {product.detail}
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/cart" className="shop-card-primary">
                Add to cart
              </Link>
              <button
                className="shop-card-secondary"
                onClick={() => setSelectedProduct(product)}
                type="button"
              >
                View details
              </button>
            </div>
          </article>
        ))}
      </section>

      {filteredProducts.length === 0 ? (
        <section className="shop-empty">
          <h2>No product found</h2>
          <p>Try another search or contact sales for help sourcing it.</p>
          <Link href="/contact" className="primary-btn">
            Contact sales
          </Link>
        </section>
      ) : null}

      {selectedProduct ? (
        <div
          aria-modal="true"
          className="product-modal-backdrop"
          role="dialog"
        >
          <article className="product-modal">
            <button
              aria-label="Close product details"
              className="product-modal-close"
              onClick={() => setSelectedProduct(null)}
              type="button"
            >
              ×
            </button>
            <div className="product-modal-image">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 720px) 90vw, 34rem"
                className="object-cover"
              />
            </div>
            <div className="product-modal-copy">
              <p className="product-category">{selectedProduct.category}</p>
              <h2>{selectedProduct.name}</h2>
              <strong>{selectedProduct.price}</strong>
              <p>{selectedProduct.detail}</p>
              <div>
                <Link href="/cart" className="primary-btn">
                  Add to cart
                </Link>
                <Link href="/contact" className="secondary-btn">
                  Confirm availability
                </Link>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
