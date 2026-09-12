import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/data/images';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './CoutureProcess.module.css';

export default function CoutureProcess() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Bespoke Couture</p>
            <h2 className={styles.heading}>The Couture Process</h2>
            <p className={styles.body}>
              Every Neels Designer Studio creation begins with an idea, shaped through
              conversation, craftsmanship and meticulous attention to detail.
              From the first sketch to the final fitting, your garment is
              developed with care and intention.
            </p>
            <p className={styles.body}>
              Our couture process is a deeply personal journey — one we
              take together.
            </p>
            <Link href="/couture" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Discover the Journey
            </Link>
          </ScrollReveal>
        </div>
        <ScrollReveal className={styles.imageCol} delay={2}>
          <Image
            src={IMAGES.coutureProcess.overview}
            alt="Neels Designer Studio couture craftsmanship — embroidery and textile work"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            loading="lazy"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
