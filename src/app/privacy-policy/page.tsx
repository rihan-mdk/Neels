import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from '../customer-care/page.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy — Neels Designer Studio',
  description:
    'Learn how Neels Designer Studio collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.subtitle}>
              Neels Designer Studio is committed to protecting your privacy and
              handling your personal data with transparency and care.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <p className={styles.updated}>Last updated: October 2026</p>
          </ScrollReveal>
        </div>

        <div className={styles.prose}>
          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Information We Collect</h2>
              <p className={styles.body}>
                When you visit our website or make a purchase, we may collect the following types of information:
              </p>
              <ul className={styles.list}>
                <li>Name, email address, phone number, and billing/shipping address</li>
                <li>Payment information (processed securely via our payment partner; we do not store card details)</li>
                <li>Order history and preferences</li>
                <li>Device and browser information for analytics and security purposes</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
              <ul className={styles.list}>
                <li>To process and fulfil your orders</li>
                <li>To communicate about your orders, enquiries, or appointments</li>
                <li>To send you editorial updates and promotions (only with your consent)</li>
                <li>To improve our website and personalise your shopping experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Sharing Your Information</h2>
              <p className={styles.body}>
                We do not sell, trade, or rent your personal information to third parties.
                We may share data with trusted service providers (e.g., delivery partners, payment
                processors) strictly to fulfil your order or provide our services.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Cookies</h2>
              <p className={styles.body}>
                Our website uses cookies to enhance your browsing experience, analyse traffic, and
                remember your preferences. You may disable cookies through your browser settings,
                though this may affect some functionality.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Your Rights</h2>
              <p className={styles.body}>
                You have the right to access, correct, or delete the personal data we hold about
                you at any time. To exercise these rights, please contact us at:
              </p>
              <p className={styles.body}>
                <a href="mailto:privacy@neelsdesignerstudio.com" style={{ color: 'var(--color-text)' }}>
                  privacy@neelsdesignerstudio.com
                </a>
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
              <p className={styles.body}>
                We may update this Privacy Policy periodically. Any changes will be reflected on
                this page with an updated date. We encourage you to review this page from time to time.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className={styles.cta}>
            <p className={styles.ctaText}>Have a question about how your data is used?</p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
