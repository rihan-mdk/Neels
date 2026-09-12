'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItemComponent from '@/components/cart/CartItem';
import styles from './page.module.css';

export default function CartPage() {
  const { items, getCartTotal, getCartCount, clearCart } = useCart();
  const count = getCartCount();
  const total = getCartTotal();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Bag</h1>
          {count > 0 && (
            <span className={styles.count}>{count} {count === 1 ? 'item' : 'items'}</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>Your bag is currently empty.</p>
            <p className={styles.emptySubtext}>
              Explore our collections to find something extraordinary.
            </p>
            <Link href="/collections" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              <div className={styles.tableHead}>
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              {items.map((item) => (
                <CartItemComponent key={item.cartId} item={item} />
              ))}
              <button
                type="button"
                onClick={clearCart}
                className={styles.clearBtn}
              >
                Clear Bag
              </button>
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <hr className={styles.summaryDivider} />
              <div className={`${styles.summaryLine} ${styles.total}`}>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className={styles.summaryNote}>
                Taxes included. Shipping and duties calculated at checkout.
              </p>
              <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                Proceed to Checkout
              </Link>
              <Link href="/collections" className={styles.continueLink}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
