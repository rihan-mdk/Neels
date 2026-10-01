import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from '../customer-care/page.module.css';

export const metadata: Metadata = {
  title: 'Terms of Service — Neels Designer Studio',
  description:
    'Read the terms and conditions governing your use of the Neels Designer Studio website and purchase of our products.',
};

export default function TermsOfServicePage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.subtitle}>
              By accessing our website or placing an order, you agree to the
              following terms. Please read them carefully.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <p className={styles.updated}>Last updated: October 2026</p>
          </ScrollReveal>
        </div>

        <div className={styles.prose}>
          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Use of This Website</h2>
              <p className={styles.body}>
                This website is operated by Neels Designer Studio. By visiting and using this
                site, you agree to be bound by these Terms of Service. We reserve the right to
                update these terms at any time; continued use of the site constitutes acceptance
                of any changes.
              </p>
              <p className={styles.body}>
                You may not use this site for any unlawful purpose or in a way that infringes the
                rights of others.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Orders & Pricing</h2>
              <ul className={styles.list}>
                <li>All prices are listed in Indian Rupees (INR) and are inclusive of GST where applicable</li>
                <li>We reserve the right to cancel any order in the event of pricing errors or stock unavailability</li>
                <li>Order confirmation does not guarantee fulfilment; we will notify you promptly of any issues</li>
                <li>International customers are responsible for customs duties and import taxes</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Intellectual Property</h2>
              <p className={styles.body}>
                All content on this website — including photographs, design files, text, and the
                Neels Designer Studio brand identity — is the exclusive property of Neels Designer
                Studio and is protected by applicable copyright and trademark law.
              </p>
              <p className={styles.body}>
                You may not reproduce, distribute, or use any content from this site without prior
                written consent.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
              <p className={styles.body}>
                Neels Designer Studio shall not be liable for any indirect, incidental, or
                consequential damages arising from your use of this website or purchase of our
                products, to the extent permitted by applicable law.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Governing Law</h2>
              <p className={styles.body}>
                These Terms of Service are governed by and construed in accordance with the laws
                of the Republic of India. Any disputes shall be subject to the exclusive jurisdiction
                of the courts of Mumbai, Maharashtra.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <p className={styles.body}>
                For any questions regarding these terms, please contact us at{' '}
                <a href="mailto:legal@neelsdesignerstudio.com" style={{ color: 'var(--color-text)' }}>
                  legal@neelsdesignerstudio.com
                </a>.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className={styles.cta}>
            <p className={styles.ctaText}>Have a question about our terms?</p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
