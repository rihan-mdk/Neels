import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Customer Care — Neels Designer Studio',
  description:
    'Need help? Our customer care team at Neels Designer Studio is here for you. Find answers to common questions or reach us directly.',
};

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Once your order is dispatched, you will receive an email with a tracking link. You can also contact us directly with your order number for a real-time update.',
  },
  {
    q: 'Can I modify or cancel my order after placing it?',
    a: 'Orders may be modified or cancelled within 24 hours of placement. Please contact us immediately at studio@neelsdesignerstudio.com and we will do our best to accommodate your request.',
  },
  {
    q: 'Do you offer custom sizing?',
    a: 'Yes. All our pieces can be made to your exact measurements at no additional charge. Simply select "Custom Size" at checkout and provide your measurements, or book an in-studio appointment.',
  },
  {
    q: 'What if my item arrives damaged?',
    a: 'We take great care in packaging, but if anything arrives damaged please photograph the item and packaging immediately and email us within 48 hours. We will arrange a replacement or full refund.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery within India takes 5–7 business days. Express delivery (2–3 days) is available at checkout. International orders typically arrive in 10–15 business days.',
  },
];

export default function CustomerCarePage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Support</p>
            <h1 className={styles.title}>Customer Care</h1>
            <p className={styles.subtitle}>
              We&apos;re here to help. Browse our most frequently asked questions
              or reach us directly — we respond within one business day.
            </p>
          </ScrollReveal>
        </div>

        {/* Contact Cards */}
        <ScrollReveal>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3 className={styles.cardTitle}>Email Us</h3>
              <p className={styles.cardText}>For all enquiries including orders, styling, and bespoke commissions.</p>
              <a href="mailto:studio@neelsdesignerstudio.com" className={styles.cardLink}>studio@neelsdesignerstudio.com</a>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.57 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.59 5.59l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/></svg>
              </div>
              <h3 className={styles.cardTitle}>Call Us</h3>
              <p className={styles.cardText}>Speak directly with our studio team, Monday–Saturday, 11am–7pm.</p>
              <a href="tel:+912245678900" className={styles.cardLink}>+91 22 4567 8900</a>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </div>
              <h3 className={styles.cardTitle}>WhatsApp</h3>
              <p className={styles.cardText}>For quick queries and order updates, message us on WhatsApp.</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={styles.cardLink}>Message Us</a>
            </div>
          </div>
        </ScrollReveal>

        {/* FAQs */}
        <div className={styles.faqSection}>
          <ScrollReveal>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          </ScrollReveal>
          <div className={styles.faqs}>
            {FAQS.map((faq, i) => (
              <ScrollReveal key={i} delay={(((i % 2) + 1) as 1 | 2)}>
                <div className={styles.faq}>
                  <h3 className={styles.faqQ}>{faq.q}</h3>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <div className={styles.cta}>
            <p className={styles.ctaText}>Still have a question?</p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
