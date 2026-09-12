'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`reveal ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
