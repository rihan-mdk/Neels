'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.container}>
        {/* ── Left Column: Typography & CTAs (45%) ── */}
        <motion.div
          className={styles.textColumn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            className={styles.eyebrowWrap}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className={styles.eyebrowDot} />
            <p className={styles.eyebrow}>NEEL’S DESIGNER STUDIO</p>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Style, Curated<br />
            For You.
          </motion.h1>

          {/* Supporting Sentence */}
          <motion.p
            className={styles.supportText}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover thoughtfully selected ready-to-wear styles for every occasion.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/collections" className={styles.primaryBtn}>
              SHOP COLLECTIONS
            </Link>
            <Link href="/jewellery" className={styles.secondaryBtn}>
              EXPLORE ACCESSORIES <ArrowRight size={13} className={styles.arrow} />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right Column: Blended Fashion Image (55%) ── */}
        <motion.div
          className={styles.imageColumn}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.imageFrame}>
            <Image
              src="/hero-image.jpeg"
              alt="Neel’s Designer Studio — High Fashion Couture"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className={styles.image}
            />
            {/* Soft Organic Blend Overlay into Hero Background */}
            <div className={styles.blendOverlay} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
