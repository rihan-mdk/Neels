'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/data/products';
import { Category } from '@/data/categories';
import styles from './CategoryPage.module.css';

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
}

export default function CategoryPageClient({
  category,
  products,
}: CategoryPageClientProps) {
  const [sort, setSort] = useState<SortOption>('featured');

  const sorted = useMemo(() => {
    switch (sort) {
      case 'price-asc':
        return [...products].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
      case 'price-desc':
        return [...products].sort((a, b) => (b.price ?? 999999) - (a.price ?? 999999));
      case 'newest':
        return [...products].filter((p) => p.isNew).concat(products.filter((p) => !p.isNew));
      default:
        return products;
    }
  }, [products, sort]);

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        <Image
          src={category.image}
          alt={category.pluralName}
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{category.pluralName}</h1>
        </div>
      </div>

      <div className={styles.page}>
        <div className={styles.inner}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: category.pluralName },
            ]}
          />

          <div className={styles.pageHead}>
            <p className={styles.description}>{category.description}</p>
            <div className={styles.sortRow}>
              <label htmlFor="category-sort" className={styles.sortLabel}>
                Sort By
              </label>
              <select
                id="category-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className={`form-select ${styles.sortSelect}`}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ProductGrid products={sorted} columns={4} />
        </div>
      </div>
    </>
  );
}
