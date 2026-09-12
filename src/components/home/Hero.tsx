import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/data/images';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.imageWrapper}>
        <Image
          src={IMAGES.hero.homepage}
          alt="Neels Designer Studio — Contemporary Indian Couture"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <p className={styles.eyebrow}>The Heritage Edit</p>
          <h1 className={styles.heading}>
            Crafted for<br />Moments That<br />Become Memories.
          </h1>
          <p className={styles.subtext}>
            A contemporary expression of Indian craftsmanship,<br className={styles.br} />
            created for celebrations that endure.
          </p>
          <div className={styles.btnWrap}>
            <Link href="/collections" className="btn btn-white">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
