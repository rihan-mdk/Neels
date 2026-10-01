import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from '../customer-care/page.module.css';

export const metadata: Metadata = {
  title: 'Shipping & Returns — Neels Designer Studio',
  description:
    'Learn about Neels Designer Studio\'s shipping policy, delivery timelines, and how to return or exchange an item.',
};

export default function ShippingReturnsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <ScrollReveal>
            <p className={styles.eyebrow}>Support</p>
            <h1 className={styles.title}>Shipping & Returns</h1>
            <p className={styles.subtitle}>
              We take great care in delivering your pieces safely and promptly.
              If something isn&apos;t right, our returns process is simple and
              straightforward.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <p className={styles.updated}>Last updated: October 2026</p>
          </ScrollReveal>
        </div>

        <div className={styles.prose}>
          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Delivery &amp; Timelines</h2>
              <p className={styles.body}>
                All orders are processed within 1–2 business days. Once dispatched
                you will receive a confirmation email with your tracking details.
              </p>
              <ul className={styles.list}>
                <li><strong>Standard Delivery (India):</strong> 5–7 business days</li>
                <li><strong>Express Delivery (India):</strong> 2–3 business days</li>
                <li><strong>International:</strong> 10–15 business days (customs may add 2–5 days)</li>
              </ul>
              <p className={styles.body}>
                Custom or made-to-measure orders require an additional 10–21 business days for
                production before dispatch.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Shipping Charges</h2>
              <ul className={styles.list}>
                <li>Free standard shipping on all India orders above ₹5,000</li>
                <li>₹199 for standard delivery on orders below ₹5,000</li>
                <li>₹399 for express delivery</li>
                <li>International shipping charges calculated at checkout based on destination</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Returns &amp; Exchanges</h2>
              <p className={styles.body}>
                We accept returns within <strong>14 days</strong> of delivery for all
                ready-to-wear items in their original, unworn condition with all tags
                attached. Items must be returned in the original packaging.
              </p>
              <ul className={styles.list}>
                <li>Email us at returns@neelsdesignerstudio.com with your order number to initiate a return</li>
                <li>We will arrange a complimentary pickup for domestic returns</li>
                <li>Refunds are processed within 7–10 business days of receiving the item</li>
                <li>Exchanges are subject to availability; contact us to check stock</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Non-Returnable Items</h2>
              <p className={styles.body}>
                The following items cannot be returned or exchanged:
              </p>
              <ul className={styles.list}>
                <li>Made-to-measure and bespoke garments</li>
                <li>Items marked &apos;Final Sale&apos; at time of purchase</li>
                <li>Accessories that have been worn (jewellery, hair accessories)</li>
                <li>Items damaged through misuse or improper care</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className={styles.cta}>
            <p className={styles.ctaText}>Need help with your order or return? Our team responds within one business day.</p>
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
