"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/store";

export type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  loading: boolean;
  addItem: (product: Product) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems(data);
    } catch {
      toast.error("Could not load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCart() {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (active) setItems(data);
      } catch {
        if (active) toast.error("Could not load cart");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCart();

    return () => {
      active = false;
    };
  }, []);

  const writeQuantity = useCallback(async (productId: string, quantity: number) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setItems(data);
  }, []);

  const addItem = useCallback(
    async (product: Product) => {
      const existing = items.find((item) => item.id === product.id);
      await writeQuantity(product.id, (existing?.quantity || 0) + 1);
      toast.success(`${product.name} added to cart`);
    },
    [items, writeQuantity]
  );

  const setQuantity = useCallback(
    async (productId: string, quantity: number) => {
      await writeQuantity(productId, quantity);
    },
    [writeQuantity]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await writeQuantity(productId, 0);
      toast.success("Item removed");
    },
    [writeQuantity]
  );

  const clearCart = useCallback(async () => {
    const response = await fetch("/api/cart", { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setItems(data);
    toast.success("Cart cleared");
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      loading,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }),
    [addItem, clearCart, items, loading, refreshCart, removeItem, setQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
