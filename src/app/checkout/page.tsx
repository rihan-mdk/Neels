'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', postal: '', country: 'India',
  });

  const total = getCartTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className={styles.confirmation}>
        <div className={styles.confirmInner}>
          <p className={styles.confirmEyebrow}>Thank you</p>
          <h1 className={styles.confirmTitle}>Order Confirmed</h1>
          <p className={styles.confirmText}>
            Your order has been received. Our team will contact you within
            24 hours to confirm the details and arrange payment.
          </p>
          <p className={styles.confirmText}>
            For couture and bespoke pieces, our styling team will reach out
            to schedule your consultation.
          </p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '32px' }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <div className={styles.fields}>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="checkout-name" className="form-label">Full Name *</label>
                  <input id="checkout-name" type="text" required className="form-input"
                    value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-email" className="form-label">Email *</label>
                  <input id="checkout-email" type="email" required className="form-input"
                    value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-phone" className="form-label">Phone</label>
                  <input id="checkout-phone" type="tel" className="form-input"
                    value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Shipping Address</h2>
              <div className={styles.fields}>
                <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="checkout-address" className="form-label">Address *</label>
                  <input id="checkout-address" type="text" required className="form-input"
                    value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-city" className="form-label">City *</label>
                  <input id="checkout-city" type="text" required className="form-input"
                    value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-state" className="form-label">State *</label>
                  <input id="checkout-state" type="text" required className="form-input"
                    value={form.state} onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-postal" className="form-label">Postal Code *</label>
                  <input id="checkout-postal" type="text" required className="form-input"
                    value={form.postal} onChange={(e) => setForm(p => ({ ...p, postal: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-country" className="form-label">Country *</label>
                  <input id="checkout-country" type="text" required className="form-input"
                    value={form.country} onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))} />
                </div>
              </div>
            </section>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px' }}>
              Place Order
            </button>
            <p className={styles.legal}>
              By placing your order you agree to our Terms of Service and Privacy Policy.
              For couture pieces, our team will contact you to arrange payment.
            </p>
          </form>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            {items.length === 0 ? (
              <p className={styles.emptyNote}>Your bag is empty. <Link href="/collections">Explore collections.</Link></p>
            ) : (
              <>
                <div className={styles.summaryItems}>
                  {items.map((item) => (
                    <div key={item.cartId} className={styles.summaryItem}>
                      <span className={styles.summaryItemName}>{item.product.name}</span>
                      <span className={styles.summaryItemMeta}>
                        Size: {item.size} · Qty: {item.quantity}
                      </span>
                      <span className={styles.summaryItemPrice}>
                        {item.product.price
                          ? `₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
                          : 'Price on Request'}
                      </span>
                    </div>
                  ))}
                </div>
                <hr className={styles.divider} />
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
