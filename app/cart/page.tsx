"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Header } from "@/components/site-shell";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { clearCart, count, items, loading, removeItem, setQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);

  return (
    <div className="landing-wrap">
      <Header />

      <main className="cart-page">
        <section className="cart-section">
          <div className="cart-section-head">
            <p className="eyebrow">Checkout Preview</p>
            {items.length > 0 && (
              <button onClick={clearCart} className="cart-clear-btn">
                Clear Cart
              </button>
            )}
          </div>

          <h1 className="page-title">Your gadget and appliance cart</h1>

          <div className="cart-list">
            {loading ? (
              <div className="cart-empty">
                <p>Loading cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is currently empty.</p>
                <Link href="/shop" className="primary-btn mt-5">
                  Continue shopping
                </Link>
              </div>
            ) : (
              items.map((product) => (
                <article key={product.id} className="cart-row">
                  <div className="cart-row-info">
                    <div className="cart-row-top">
                      <p className="cart-item-name">{product.name}</p>
                      <p className="cart-item-price">{product.price}</p>
                    </div>
                    <p className="cart-item-category">{product.category}</p>
                    <div className="cart-row-controls">
                      <button
                        onClick={() =>
                          setQuantity(product.id, Math.max(1, product.quantity - 1))
                        }
                        className="cart-qty-btn"
                      >
                        -
                      </button>
                      <span className="cart-qty-value">{product.quantity}</span>
                      <button
                        onClick={() => setQuantity(product.id, product.quantity + 1)}
                        className="cart-qty-btn"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="cart-remove-btn"
                        aria-label={`Remove ${product.name}`}
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

        <aside className="checkout-card">
          <h2>Order Summary</h2>
          <p>
            Submit your request and our sales team will confirm stock
            availability, delivery fee, and payment details.
          </p>

          <div className="summary-line">
            <span>Items</span>
            <strong>{count}</strong>
          </div>

          <div className="summary-line">
            <span>Total</span>
            <strong>NGN {new Intl.NumberFormat("en-NG").format(total)}</strong>
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
    </div>
  );
}
