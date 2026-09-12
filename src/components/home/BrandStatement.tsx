import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './BrandStatement.module.css';

export default function BrandStatement() {
  return (
    <section className={styles.section} aria-label="Brand statement">
      <div className={styles.inner}>
        <ScrollReveal>
          <blockquote className={styles.statement}>
            <span className={styles.line}>Crafted with Heritage.</span>
            <span className={styles.line}>Designed for Tomorrow.</span>
          </blockquote>
          <p className={styles.byline}>— Neels Designer Studio</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
