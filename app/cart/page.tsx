"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Footer, Header } from "@/components/site-shell";
import { products } from "@/lib/store";

export default function CartPage() {
  const [cartItems, setCartItems] = useState(
    products.slice(0, 3).map((product) => ({
      ...product,
      quantity: 1,
    })),
  );

  const increaseQuantity = (name: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (name: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.name === name && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeItem = (name: string) => {
    setCartItems((items) => items.filter((item) => item.name !== name));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <div className="landing-wrap">
      <Header />

      <main className="cart-page">
        {/* LEFT SECTION */}
        <section className="cart-section">
          <div className="cart-section-head">
            <p className="eyebrow">Checkout Preview</p>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="cart-clear-btn">
                Clear Cart
              </button>
            )}
          </div>

          <h1 className="page-title">Your gadget and appliance cart</h1>

          <div className="cart-list">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is currently empty.</p>
              </div>
            ) : (
              cartItems.map((product) => (
                <article key={product.name} className="cart-row">
                  <div className="cart-row-info">
                    <div className="cart-row-top">
                      <p className="cart-item-name">{product.name}</p>
                      <p className="cart-item-price">{product.price}</p>
                    </div>
                    <p className="cart-item-category">{product.category}</p>
                    <div className="cart-row-controls">
                      <button
                        onClick={() => decreaseQuantity(product.name)}
                        className="cart-qty-btn"
                      >
                        -
                      </button>
                      <span className="cart-qty-value">{product.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(product.name)}
                        className="cart-qty-btn"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(product.name)}
                        className="cart-remove-btn"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* ORDER SUMMARY */}
        <aside className="checkout-card">
          <h2>Order Summary</h2>
          <p>
            Submit your request and our sales team will confirm stock
            availability, delivery fee, and payment details.
          </p>

          <div className="summary-line">
            <span>Items</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="summary-line">
            <span>Delivery</span>
            <strong>To confirm</strong>
          </div>

          <Link href="/checkout" className="primary-btn cart-checkout-btn">
            Continue checkout
          </Link>
        </aside>
      </main>

      {/* <Footer /> */}
    </div>
  );
}