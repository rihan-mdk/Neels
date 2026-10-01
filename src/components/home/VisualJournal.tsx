import React from 'react';
import Image from 'next/image';
import { IMAGES } from '@/data/images';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import styles from './VisualJournal.module.css';

export default function VisualJournal() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ScrollReveal>
          <SectionHeading
            title="The Neels Journal"
            subtitle="From the studio. From the celebrations. From the craft."
            centered
          />
        </ScrollReveal>

        <div className={styles.grid}>
          {IMAGES.journal.map((src, i) => (
            <ScrollReveal key={i} delay={(i % 4) as 0 | 1 | 2 | 3 | 4} className={styles.revealWrap}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tile}
                aria-label={`View Neels Journal story #${i + 1} on Instagram`}
              >
                <Image
                  src={src}
                  alt={`Neels journal — campaign photography ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.tileOverlay}>
                  <div className={styles.tileMeta}>
                    <span className={styles.storyTag}>Story #{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.storyAction}>View on Instagram ↗</span>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <div className={styles.footer}>
          <ScrollReveal delay={2}>
            <a
              href="https://www.instagram.com/neels_designer_studio?stkn=aDk1emZ3aHVicDZl"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-secondary ${styles.instaBtn}`}
            >
              <span>Follow on Instagram</span>
              <span className={styles.instaArrow}>→</span>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
