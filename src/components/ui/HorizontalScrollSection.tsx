'use client';

import React, { useRef, useEffect } from 'react';
import styles from './HorizontalScrollSection.module.css';

interface HorizontalScrollSectionProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
  bg?: string;
}

export default function HorizontalScrollSection({
  title,
  eyebrow,
  subtitle,
  children,
  bg,
}: HorizontalScrollSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const getMaxTranslate = () => {
      if (!trackRef.current) return 0;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      return Math.max(0, trackWidth - viewportWidth);
    };

    const setup = () => {
      if (!outerRef.current || !trackRef.current) return;
      if (window.innerWidth < 768) {
        outerRef.current.style.height = 'auto';
        if (trackRef.current) {
          trackRef.current.style.transform = 'none';
        }
        return;
      }
      const maxTranslate = getMaxTranslate();
      // Outer height: full screen + the horizontal distance to travel
      outerRef.current.style.height = `${window.innerHeight + maxTranslate * 1.12}px`;
    };

    const update = () => {
      if (!outerRef.current || !trackRef.current) return;
      if (window.innerWidth < 768) return;

      const outerRect = outerRef.current.getBoundingClientRect();
      const outerHeight = outerRef.current.offsetHeight;
      const scrollable = outerHeight - window.innerHeight;
      if (scrollable <= 0) return;

      // Distance scrolled from top of section
      const scrolled = Math.max(0, -outerRect.top);
      const progress = Math.min(1, Math.max(0, scrolled / scrollable));

      const maxTranslate = getMaxTranslate();
      trackRef.current.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    const onResize = () => {
      setup();
      requestAnimationFrame(update);
    };

    setup();
    update();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(() => {
        setup();
        update();
      });
      ro.observe(trackRef.current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={outerRef} className={styles.outer}>
      <div ref={stickyRef} className={styles.sticky} style={bg ? { backgroundColor: bg } : undefined}>
        {/* Heading */}
        <div className={styles.headingRow}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Card track */}
        <div className={styles.trackWrapper}>
          <div ref={trackRef} className={styles.track}>
            {children}
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap} aria-hidden="true">
          <div className={styles.progressBg}>
            <div ref={progressBarRef} className={styles.progressFill} />
          </div>
          <span className={styles.scrollHint}>Scroll to explore</span>
        </div>
      </div>
    </div>
  );
}
