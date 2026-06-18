"use client";

import type { Product } from "@/lib/store";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className: string;
}) {
  const { addItem } = useCart();

  return (
    <button onClick={() => addItem(product)} className={className} type="button">
      Add to cart
    </button>
  );
}
