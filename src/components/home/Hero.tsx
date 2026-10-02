'use client';

import React from 'react';
import Link from 'next/link';
import { ExpandableGallery } from '@/components/ui/gallery-animation';
import styles from './Hero.module.css';

const HERO_GALLERY_IMAGES = [
  '/hero-gallery-1.jpeg',
  '/hero-gallery-2.jpeg',
  '/hero-gallery-3.jpeg',
  '/hero-gallery-4.jpeg',
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.container}>
        {/* Left Column: Brand Story & Typography */}
        <div className={styles.textColumn}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badgeDot} />
            <p className={styles.eyebrow}>Neels Designer Studio</p>
          </div>

          <h1 className={styles.heading}>
            Wear the Story.<br />
            <span className={styles.headingItalic}>Live the Style.</span>
          </h1>

          <div className={styles.divider} aria-hidden="true" />

          <p className={styles.subtext}>
            Timeless designs. Thoughtfully crafted.<br className={styles.br} />
            Made for your every moment.
          </p>

          <div className={styles.btnWrap}>
            <Link href="/collections" className={styles.primaryBtn}>
              Explore Collection
            </Link>
            <Link href="/about" className={styles.ghostLink}>
              Our Story <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Expandable Gallery Showcase */}
        <div className={styles.imageColumn}>
          <ExpandableGallery images={HERO_GALLERY_IMAGES} />
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot} />
        </div>
      </div>
    </section>
  );
}
