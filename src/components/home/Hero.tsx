'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';
import { AnimatedMarqueeHero } from '@/components/ui/hero-3';

// ── Mobile carousel slides ──────────────────────────────────────────────────
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
    if (Math.abs(dx) < Math.abs(dy)) return; // vertical scroll wins
    if (Math.abs(dx) < 40) return;            // too small
    resetTimer();
    if (dx < 0) next(); else prev();
  };

  const slide = HERO_SLIDES[current];

  return (
    <>
      {/* Desktop hero renders full-page, outside the mobile-only section */}

      {/* DESKTOP - AnimatedMarqueeHero */}
      <div className="hidden md:block w-full">
        <AnimatedMarqueeHero
          tagline="Neel's Designer Studio"
          title={
            <>
              Style,{" "}
              <span style={{ fontStyle: "italic", color: "#8C5A54" }}>Curated</span>
              <br />
              For You.
            </>
          }
          description="Discover thoughtfully selected ready-to-wear styles for every occasion — from bridal lehengas to everyday elegance."
          ctaText="Shop Collections"
          ctaHref="/collections"
          secondaryCtaText="Explore Accessories"
          secondaryCtaHref="/jewellery"
          images={[
            "/hero-gallery-1.jpeg",
            "/hero-gallery-2.jpeg",
            "/hero-gallery-3.jpeg",
            "/hero-gallery-4.jpeg",
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
          ]}
        />
      </div>

      <div className="md:hidden">
        <section className={styles.hero} aria-label="Hero mobile">
      {/* MOBILE - full-screen auto-sliding carousel */}
      <div
        className={styles.mobileSlider}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Featured collections slider"
      >

        {/* Slide images */}
        <div className={styles.slideTrack}
          style={{ transform: `translateX(-${current * 100}%)` }}>
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


