'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight } from 'lucide-react';
import type { Product } from '@/data/products';
import ProductGrid from '@/components/products/ProductGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './NewArrivals.module.css';

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const newArrivals = products;

  return (
    <section className={styles.section} aria-label="New Arrivals">

      {/* ── Section header — shared for both layouts ── */}
      <div className={styles.sectionHead}>
        <div className={styles.headLeft}>
          <p className={styles.headEyebrow}>Fresh Styles</p>
          <h2 className={styles.headTitle}>New Arrivals</h2>
        </div>
        <Link href="/collections" className={styles.viewAll}>View All</Link>
      </div>

      {/* ── MOBILE: horizontal scroll row ── */}
      <div className={styles.mobileRow} aria-label="New arrivals scroll">
        {newArrivals.slice(0, 6).map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className={styles.card}
          >
            <div className={styles.cardImage}>
              <Image
                src={product.images.primary}
                alt={product.name}
                fill
                sizes="160px"
                className={styles.cardImg}
              />
              <button
                className={styles.wishBtn}
                aria-label={`Add ${product.name} to wishlist`}
                onClick={(e) => e.preventDefault()}
              >
                <Heart size={14} strokeWidth={1.5} />
              </button>
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardCategory}>
                {product.category === 'suits-dresses' ? 'Suits & Dresses' :
                  product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              <p className={styles.cardName}>{product.name}</p>
              <p className={styles.cardPrice}>{product.priceFormatted}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── DESKTOP: existing grid layout ── */}
      <div className={styles.desktopGrid}>
        <div className={styles.inner}>
          <ScrollReveal>
            <div className={styles.header}>
              <SectionHeading
                title="New Arrivals"
                subtitle="Curated ready-to-wear styles and newly unveiled festive silhouettes for your every moment."
                centered
              />
            </div>
          </ScrollReveal>
          <ProductGrid products={newArrivals} columns={4} />
          <ScrollReveal>
            <div className={styles.actionWrap}>
              <Link href="/collections" className={styles.viewAllBtn}>
                <span>Shop All New Arrivals</span>
                <ArrowRight size={13} strokeWidth={2} className={styles.arrow} aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>

    </section>
  );
}
