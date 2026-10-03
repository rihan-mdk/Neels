'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './BrandStatement.module.css';

export default function BrandStatement() {
  return (
    <>
      {/* ── DESKTOP — existing clean quote block ── */}
      <section className={styles.sectionDesktop} aria-label="Brand statement">
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

      {/* ── MOBILE — dark editorial banner with image background ── */}
      <section className={styles.sectionMobile} aria-label="Brand statement">
        <div className={styles.mobileBanner}>
          <Image
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
            alt="Neel's Designer Studio — Crafted with Heritage"
            fill
            sizes="100vw"
            className={styles.mobileBannerImg}
            loading="lazy"
          />
          <div className={styles.mobileBannerOverlay} aria-hidden />
          <div className={styles.mobileBannerContent}>
            <p className={styles.mobileBannerEyebrow}>Our Philosophy</p>
            <h3 className={styles.mobileBannerHeading}>
              Crafted with Heritage.<br />
              Designed for Tomorrow.
            </h3>
            <p className={styles.mobileBannerSub}>
              Ready-to-wear styles that honour Indian craftsmanship and modern elegance.
            </p>
            <Link href="/collections" className={styles.mobileBannerCta}>
              Explore Collections
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
