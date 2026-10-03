'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, UserCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './CartNotification.module.css';

export default function CartNotification() {
  const { lastAdded, dismissNotification } = useCart();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  if (!lastAdded) return null;

  return (
    <div
      className={styles.notificationWrapper}
      role="status"
      aria-live="polite"
    >
      {/* Product Thumbnail */}
      <div className={styles.thumbWrapper}>
        <Image
          src={lastAdded.product.images.primary}
          alt={lastAdded.product.name}
          fill
          sizes="52px"
          className={styles.thumb}
        />
      </div>

      {/* Details */}
      <div className={styles.details}>
        <div className={styles.statusRow}>
          <span className={styles.checkDot} />
          <span className={styles.statusText}>Added to Bag</span>
        </div>
        <p className={styles.productName}>{lastAdded.product.name}</p>
        <span className={styles.metaText}>
          Size: {lastAdded.size} {!isLoggedIn && '• Guest mode'}
        </span>
        {!isLoggedIn && (
          <p className={styles.loginNotice}>
            Please sign in to save your cart &amp; track orders.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actionRow}>
        {!isLoggedIn && (
          <Link
            href="/login"
            className={styles.signInBtn}
            onClick={dismissNotification}
          >
            Sign In <UserCheck size={12} />
          </Link>
        )}
        <Link
          href="/cart"
          className={styles.viewCartBtn}
          onClick={dismissNotification}
        >
          View Cart <ArrowRight size={12} />
        </Link>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={dismissNotification}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
