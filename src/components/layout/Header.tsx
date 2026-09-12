'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchOverlay from '@/components/overlays/SearchOverlay';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Lehengas', href: '/lehengas' },
  { label: 'Accessories', href: '/jewellery' },
  { label: 'Suits & Dresses', href: '/suits-dresses' },
  { label: 'Collections', href: '/collections' },
  { label: 'Couture', href: '/couture' },
  { label: 'Stores', href: '/stores' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={styles.bar}>

          {/* ── LEFT: Logo ──────────────────────────── */}
          <Link href="/" className={styles.logo} aria-label="Neels Designer Studio — Home">
            <span className={styles.logoName}>Neels</span>
            <span className={styles.logoStudio}>Designer Studio</span>
          </Link>

          {/* ── CENTER: Desktop Nav ──────────────────── */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${80 + i * 55}ms` }}
                className={`${styles.navLink} ${
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))
                    ? styles.navLinkActive
                    : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT: Actions (Search, Bag, Mobile menu) ── */}
          <div className={styles.actions}>
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={15} strokeWidth={1.5} />
            </button>
            <Link
              href="/cart"
              className={styles.bagLink}
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </Link>
            <button
              className={`${styles.iconBtn} ${styles.menuBtn}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className={styles.mobileDrawerHeader}>
          <Link href="/" className={styles.mobileLogoSmall}>
            <span className={styles.logoName}>Neels</span>
            <span className={styles.logoStudio}>Designer Studio</span>
          </Link>
          <button className={styles.iconBtn} onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className={styles.mobileNavItems}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavLink} ${pathname === item.href ? styles.mobileNavLinkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className={styles.mobileDrawerFooter}>
          <button className={styles.mobileUtilLink} onClick={() => { setMobileOpen(false); setSearchOpen(true); }}>
            Search
          </button>
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
