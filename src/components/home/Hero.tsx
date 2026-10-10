'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

// ── Mobile carousel slides (kept 100% untouched for mobile) ───────────────
const HERO_SLIDES = [
  {
    id: 1,
    image: '/hero-image.jpeg',
    tag: 'New Season',
    title: 'Style,\nCurated\nFor You.',
    cta: 'Shop Collections',
    href: '/collections',
    position: 'center 20%',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
    tag: 'Bridal Edit',
    title: 'Royal\nLehengas\nAwaits.',
    cta: 'Explore Lehengas',
    href: '/lehengas',
    position: 'center 20%',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85',
    tag: 'Fine Drapes',
    title: 'Timeless\nSarees,\nCrafted.',
    cta: 'View Sarees',
    href: '/sarees',
    position: 'center 25%',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
    tag: 'Ready to Wear',
    title: 'Elegant\nSuits &\nAnarkalis.',
    cta: 'Shop Suits',
    href: '/suits-dresses',
    position: 'center 40%',
  },
];

const SLIDE_INTERVAL = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % HERO_SLIDES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [current, goTo]);

  // Auto-advance
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, SLIDE_INTERVAL);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < Math.abs(dy)) return;
    if (Math.abs(dx) < 40) return;
    resetTimer();
    if (dx < 0) next(); else prev();
  };

  const slide = HERO_SLIDES[current];

  return (
    <>
      {/* ────────────────────────────────────────────────────────────
          DESKTOP HERO — Pixel-perfect Canva Editorial Split Design
      ──────────────────────────────────────────────────────────── */}
      <section className={styles.desktopHero} aria-label="Hero showcase">
        {/* Left Burgundy Editorial Column */}
        <div className={styles.desktopLeft}>
          <motion.h1
            className={styles.desktopHeadline}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Wear the Story.<br />
            Live the Style.
          </motion.h1>

          <motion.p
            className={styles.desktopSubtitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            Discover thoughtfully selected ready-to-wear styles for every occasion — from bridal lehengas to everyday elegance.
          </motion.p>

          <motion.div
            className={styles.desktopButtonRow}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/collections" className={styles.shopCollectionsBtn}>
              SHOP COLLECTIONS
            </Link>
            <Link href="/jewellery" className={styles.exploreAccessoriesBtn}>
              EXPLORE ACCESSORIES
            </Link>
          </motion.div>
        </div>

        {/* Right High-Resolution Model Portrait Column */}
        <div className={styles.desktopRight}>
          <Image
            src="/hero-bougainvillea.png"
            alt="Wear the Story. Live the Style. — Neels Couture"
            fill
            priority
            sizes="(min-width: 769px) 42vw, 100vw"
            className={styles.desktopModelImg}
          />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          MOBILE HERO — Full-screen auto-sliding carousel (≤ 768px)
      ──────────────────────────────────────────────────────────── */}
      <div className="md:hidden">
        <section className={styles.hero} aria-label="Hero mobile">
          <div
            className={styles.mobileSlider}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-label="Featured collections slider"
          >
            {/* Slide images */}
            <div
              className={styles.slideTrack}
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {HERO_SLIDES.map((s) => (
                <div key={s.id} className={styles.slide} aria-hidden={s.id !== slide.id}>
                  <Image
                    src={s.image}
                    alt={s.title.replace(/\n/g, ' ')}
                    fill
                    priority={s.id === 1}
                    sizes="100vw"
                    className={styles.slideImage}
                    style={{ objectPosition: s.position || 'center 25%' }}
                  />
                </div>
              ))}
            </div>

            {/* Gradient + content overlay */}
            <div className={styles.slideOverlay} aria-hidden="true" />
            <div className={styles.slideContent}>
              <motion.h2
                key={`title-${current}`}
                className={styles.slideTitle}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                {slide.title}
              </motion.h2>
              <motion.div
                key={`cta-${current}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <Link href={slide.href} className={styles.slideCta}>
                  {slide.cta}
                </Link>
              </motion.div>
            </div>

            {/* Dots */}
            <div className={styles.slideDots} role="tablist" aria-label="Slide indicators">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Slide ${i + 1}`}
                  className={i === current ? styles.dotActive : styles.dot}
                  onClick={() => { goTo(i); resetTimer(); }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
