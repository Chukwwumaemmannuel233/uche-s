import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card group">
      <div className="product-media">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="product-tag">{product.tag}</span>
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
      <p className="mt-3 text-sm leading-6 text-[#536476]">{product.detail}</p>
      <div className="mt-5 flex gap-3">
        <AddToCartButton
          product={product}
          className="rounded-full bg-[#1273c4] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0a4f8f]"
        />
        <Link
          href="/contact"
          className="rounded-full border border-[#d8e0ea] px-4 py-3 text-sm font-black text-[#111827] transition hover:border-[#1273c4] hover:text-[#0a4f8f]"
        >
          Ask price
        </Link>
      </div>
    </article>
  );
}
