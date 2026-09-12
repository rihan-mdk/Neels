import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

const footerLinks = {
  shop: [
    { label: 'Lehengas', href: '/lehengas' },
    { label: 'Accessories', href: '/jewellery' },
    { label: 'Suits & Dresses', href: '/suits-dresses' },
    { label: 'Collections', href: '/collections' },
    { label: 'Couture', href: '/couture' },
  ],
  company: [
    { label: 'About Neels', href: '/couture' },
    { label: 'Our Stores', href: '/stores' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Couture Appointments', href: '/couture#book' },
  ],
  support: [
    { label: 'Customer Care', href: '/contact#care' },
    { label: 'Shipping & Returns', href: '/contact#shipping' },
    { label: 'Privacy Policy', href: '/contact#privacy' },
    { label: 'Terms of Service', href: '/contact#terms' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        {/* Top */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoName}>Neels</span>
              <span className={styles.logoStudio}>Designer Studio</span>
            </Link>
            <p className={styles.tagline}>
              Contemporary Indian Couture
            </p>
            <div className={styles.social}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow Neels Designer Studio on Instagram"
              >
                <InstagramIcon />
                <span>Instagram</span>
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Message Neels Designer Studio on WhatsApp"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Shop</h3>
              {footerLinks.shop.map((link) => (
                <Link key={link.label} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Company</h3>
              {footerLinks.company.map((link) => (
                <Link key={link.label} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Support</h3>
              {footerLinks.support.map((link) => (
                <Link key={link.label} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            © 2026 Neels Designer Studio. All Rights Reserved.
          </span>
          <div className={styles.bottomLinks}>
            <Link href="/contact" className={styles.bottomLink}>Privacy</Link>
            <Link href="/contact" className={styles.bottomLink}>Terms</Link>
            <Link href="/contact" className={styles.bottomLink}>Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
