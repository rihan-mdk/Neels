import React from 'react';
import Link from 'next/link';
import { getNewArrivals } from '@/data/products';
import ProductGrid from '@/components/products/ProductGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './NewArrivals.module.css';

export default function NewArrivals() {
  const newArrivals = getNewArrivals(8);

  return (
    <section className={styles.section} aria-label="New Arrivals">
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
              Shop All New Arrivals <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
