'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './CartNotification.module.css';

export default function CartNotification() {
  const { lastAdded, dismissNotification } = useCart();

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
        <span className={styles.metaText}>Size: {lastAdded.size}</span>
      </div>

      {/* Action: View Cart */}
      <div className={styles.actionRow}>
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
