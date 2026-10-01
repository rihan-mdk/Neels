import type { Metadata } from 'next';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About | Neels Designer Studio',
  description: 'The story, artistry, and vision of Neels Designer Studio — handcrafted luxury couture and timeless Indian aesthetics.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Our Heritage</p>
            <h1 className={styles.title}>
              Crafted in Tradition,<br />Sculpted for Eternity
            </h1>
            <p className={styles.subtitle}>
              Neels Designer Studio is an ode to timeless Indian craftsmanship. Every silhouette is born from meticulous hand-embroidery, heirloom textiles, and an architectural reverence for modern form.
            </p>
          </ScrollReveal>
        </div>

        <div className={styles.valuesGrid}>
          <ScrollReveal>
            <div className={styles.valueCard}>
              <span className={styles.cardNumber}>01</span>
              <h2 className={styles.cardTitle}>Artisanal Mastery</h2>
              <p className={styles.cardDesc}>
                Generations of master karigars breathe life into zardozi, gota patti, and intricate threadwork with unhurried precision.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.valueCard}>
              <span className={styles.cardNumber}>02</span>
              <h2 className={styles.cardTitle}>Pure Silks & Velvets</h2>
              <p className={styles.cardDesc}>
                We source only the finest raw silks, tissues, handwoven organzas, and regal velvets dyed in bespoke archival shades.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.valueCard}>
              <span className={styles.cardNumber}>03</span>
              <h2 className={styles.cardTitle}>Bespoke Couture</h2>
              <p className={styles.cardDesc}>
                From personalized bridal consultations to one-of-a-kind evening ensembles, every creation is tailored to individual radiance.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
