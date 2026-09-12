import React from 'react';
import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No products found.</p>
      </div>
    );
  }

  return (
    <div
      className={styles.grid}
      data-columns={columns}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {products.map((product, i) => (
        <ScrollReveal key={product.id} delay={((i % columns) + 1) as 1 | 2 | 3 | 4}>
          <ProductCard product={product} />
        </ScrollReveal>
      ))}
    </div>
  );
}
