'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const hasHoverImage = !!product.images.hover;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${product.name} — ${product.priceFormatted}`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={product.images.primary}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`${styles.image} ${hovered && hasHoverImage ? styles.imageHide : styles.imageShow}`}
          loading="lazy"
        />
        {hasHoverImage && (
          <Image
            src={product.images.hover!}
            alt={`${product.name} — alternate view`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`${styles.image} ${hovered ? styles.imageShow : styles.imageHide}`}
            loading="lazy"
          />
        )}
        {product.isNew && (
          <span className={styles.badge}>New</span>
        )}
        <div className={styles.quickView} aria-hidden="true">
          <span>Discover Piece</span>
          <span className={styles.quickArrow}>→</span>
        </div>
      </div>
      <div className={styles.info}>
        <span className={styles.brand}>Neels</span>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>{product.priceFormatted}</span>
      </div>
    </Link>
  );
}
