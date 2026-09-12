import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/data/collections';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import styles from './FeaturedCollections.module.css';

export default function FeaturedCollections() {
  return (
    <HorizontalScrollSection
      eyebrow="Curated for You"
      title="The Collections"
      subtitle="Four distinct worlds. Each defined by a singular vision."
      bg="var(--color-background)"
    >
      {COLLECTIONS.map((col) => (
        <Link key={col.id} href={`/collections/${col.slug}`} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={col.image}
              alt={col.name}
              fill
              sizes="(max-width: 768px) 72vw, 38vw"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.overlay} aria-hidden="true" />
          </div>
          <div className={styles.info}>
            <p className={styles.season}>SS 2026</p>
            <h3 className={styles.name}>{col.name}</h3>
            <p className={styles.desc}>{col.description}</p>
            <span className={styles.explore}>
              Explore Collection
              <span className={styles.arrow} aria-hidden="true"> →</span>
            </span>
          </div>
        </Link>
      ))}
    </HorizontalScrollSection>
  );
}
