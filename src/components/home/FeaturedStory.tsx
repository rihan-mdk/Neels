import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/data/images';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './FeaturedStory.module.css';

export default function FeaturedStory() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Text Column */}
        <div className={styles.textCol}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Our Story</p>
            <h2 className={styles.heading}>
              The Art of<br />the Occasion
            </h2>
            <p className={styles.body}>
              Rooted in Indian craftsmanship and shaped by a contemporary
              sensibility, Neels Designer Studio creates pieces where intricate detail,
              considered silhouettes and timeless textiles come together.
            </p>
            <p className={styles.body}>
              Every creation carries the touch of artisans who have dedicated
              their lives to perfecting their craft — and the vision of a
              design house that believes in the quiet power of a well-made
              garment.
            </p>
            <Link href="/about" className="btn btn-secondary" style={{ marginTop: '8px' }}>
              Discover Neels Designer Studio
            </Link>
          </ScrollReveal>
        </div>

        {/* Editorial Image Grid */}
        <div className={styles.imageGrid}>
          <ScrollReveal className={styles.imageTall} delay={1}>
            <Image
              src={IMAGES.featuredStory.main}
              alt="Neels Designer Studio — Indian couture craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className={styles.image}
              loading="lazy"
            />
          </ScrollReveal>
          <div className={styles.imageStack}>
            <ScrollReveal className={styles.imageShort} delay={2}>
              <Image
                src={IMAGES.featuredStory.secondary}
                alt="Neels Designer Studio — embroidery detail"
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className={styles.image}
                loading="lazy"
              />
            </ScrollReveal>
            <ScrollReveal className={styles.imageShort} delay={3}>
              <Image
                src={IMAGES.featuredStory.accent}
                alt="Neels Designer Studio — textile heritage"
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className={styles.image}
                loading="lazy"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
