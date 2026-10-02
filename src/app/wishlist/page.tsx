'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Wishlist</h1>
          <p className={styles.subtitle}>
            {items.length === 1
              ? '1 saved piece'
              : `${items.length} saved pieces`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <Heart size={44} strokeWidth={1.2} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
            <p className={styles.emptyDesc}>
              Save your favourite couture and ready-to-wear pieces here to revisit
              or add to your shopping bag anytime.
            </p>
            <Link href="/collections" className={styles.exploreBtn}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((product) => (
              <div key={product.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Link href={`/product/${product.slug}`}>
                    <Image
                      src={product.images.primary}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={styles.image}
                    />
                  </Link>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className={styles.info}>
                  <Link href={`/product/${product.slug}`} className={styles.name}>
                    {product.name}
                  </Link>
                  <span className={styles.price}>{product.priceFormatted}</span>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.addToBagBtn}
                    onClick={() => {
                      const defaultSize = product.sizes[0] || 'M';
                      addToCart(product, defaultSize);
                    }}
                  >
                    Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
