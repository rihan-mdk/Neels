import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IMAGES } from '@/data/images';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Couture',
  description:
    'Discover the Neels Designer Studio couture process — from initial consultation to the final creation. Bespoke Indian couture crafted for extraordinary occasions.',
};

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Initial Consultation',
    text: 'Begin with a conversation. We seek to understand the occasion, the vision, the preferences and the personality of the wearer. Every detail matters.',
    image: IMAGES.coutureProcess.consultation,
  },
  {
    number: '02',
    title: 'Measurements',
    text: 'Precise measurements create the foundation for a silhouette that feels as effortless as it looks. We take every measurement with care.',
    image: IMAGES.coutureProcess.measurement,
  },
  {
    number: '03',
    title: 'Design Development',
    text: 'Our designers translate ideas, references and craftsmanship into a considered couture design, presented for your approval before work begins.',
    image: IMAGES.coutureProcess.design,
  },
  {
    number: '04',
    title: 'Crafting',
    text: 'Skilled artisans bring the design to life through embroidery, textile work, embellishment and meticulous hand-finishing across every detail.',
    image: IMAGES.coutureProcess.crafting,
  },
  {
    number: '05',
    title: 'Final Fitting',
    text: 'The garment is refined through careful fitting and adjustments to ensure perfect comfort, movement, proportion and balance.',
    image: IMAGES.coutureProcess.fitting,
  },
  {
    number: '06',
    title: 'The Final Creation',
    text: 'A finished Neels Designer Studio creation — prepared, pressed and packaged — ready for the occasion it was made to become part of.',
    image: IMAGES.coutureProcess.finalCreation,
  },
];

export default function CouturePage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Image
          src={IMAGES.hero.couture}
          alt="Neels Designer Studio Couture — The journey of bespoke luxury"
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Bespoke Couture</p>
          <h1 className={styles.heroTitle}>Couture</h1>
          <p className={styles.heroSub}>The Journey of Bespoke Luxury</p>
        </div>
      </div>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <ScrollReveal>
            <h2 className={styles.introHeading}>
              Crafting Your Dream Silhouette
            </h2>
            <p className={styles.introText}>
              From the first conversation to the final fitting, every Neels Designer Studio
              couture creation is developed with intention, precision and care.
              We believe that a truly extraordinary garment begins not with
              fabric, but with understanding.
            </p>
            <p className={styles.introText}>
              Our bespoke couture service is available by appointment, at our
              studios in Mumbai and Delhi — and for clients worldwide, we offer
              virtual consultations with our styling team.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Book a Consultation
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Process Steps */}
      <section className={styles.process}>
        <div className={styles.processInner}>
          {PROCESS_STEPS.map((step, i) => (
            <ScrollReveal key={step.number}>
              <div className={`${styles.step} ${i % 2 !== 0 ? styles.stepReversed : ''}`}>
                <div className={styles.stepImage}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.stepImg}
                    loading="lazy"
                  />
                </div>
                <div className={styles.stepContent}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <ScrollReveal>
          <p className={styles.ctaEyebrow}>Begin Your Journey</p>
          <h2 className={styles.ctaTitle}>
            Let Us Create<br />Something Beautiful
          </h2>
          <p className={styles.ctaText}>
            Contact our couture team to begin a conversation about your
            bespoke creation.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Book a Consultation
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
