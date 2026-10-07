'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ChevronDown, ArrowUpRight, UserCircle2, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchOverlay from '@/components/overlays/SearchOverlay';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subTitle?: string;
  subItems?: NavSubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Collection',
    href: '/collections',
    subTitle: 'Atelier Silhouettes',
    subItems: [
      { label: 'Korean', href: '/collections?category=korean' },
      { label: 'Short kurti', href: '/collections?category=short-kurti' },
      { label: 'Pakistani', href: '/collections?category=pakistani' },
      { label: 'Lehenga', href: '/lehengas' },
      { label: 'Gown', href: '/collections?category=gown' },
      { label: 'Party wear', href: '/collections?category=party-wear' },
      { label: 'Co-ord set', href: '/collections?category=coord-set' },
      { label: 'Jeans', href: '/collections?category=jeans' },
    ],
  },
  {
    label: 'Accessories',
    href: '/jewellery',
    subTitle: 'Fine Accents',
    subItems: [
      { label: 'Bracelet', href: '/jewellery?category=bracelet' },
      { label: 'Clutches', href: '/jewellery?category=clutches' },
      { label: 'Rings', href: '/jewellery?category=rings' },
    ],
  },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, searchOpen]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleMobileAccordion = (label: string) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <header
        className={`hidden md:block ${styles.header} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <div className={styles.bar}>

          {/* ── LEFT: Logo (Icon Only) ──────────────── */}
          <Link href="/" className={styles.logo} aria-label="Neels Designer Studio — Home">
            <Image
              src="/logo-black.png"
              alt="Neels Designer Studio Logo"
              width={44}
              height={44}
              className={styles.logoImg}
              priority
            />
          </Link>

          {/* ── CENTER: Desktop Nav with Animated Dropdowns ── */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {NAV_ITEMS.map((item, i) => {
              const hasDropdown = Boolean(item.subItems && item.subItems.length > 0);
              const isOpen = activeDropdown === item.label;
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              if (hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className={styles.navItemWrapper}
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      style={{ animationDelay: `${80 + i * 55}ms` }}
                      className={`${styles.navTrigger} ${isActive ? styles.navTriggerActive : ''}`}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={11}
                        className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`}
                        aria-hidden="true"
                      />
                    </Link>

                    {/* Animated Dropdown Floating Panel */}
                    <div
                      className={`${styles.dropdownContainer} ${isOpen ? styles.dropdownContainerOpen : ''
                        }`}
                      role="menu"
                      aria-label={`${item.label} sub-navigation`}
                    >
                      <div className={styles.dropdownCard}>
                        <div className={styles.dropdownArrow} aria-hidden="true" />
                        <div className={styles.dropdownHeader}>
                          <span className={styles.dropdownSubTitle}>
                            {item.subTitle || item.label}
                          </span>
                          <Link
                            href={item.href}
                            className={styles.dropdownViewAll}
                            onClick={() => setActiveDropdown(null)}
                          >
                            All {item.label}
                            <ArrowUpRight size={10} />
                          </Link>
                        </div>

                        <div
                          className={
                            item.label === 'Dresses'
                              ? styles.dropdownGridDresses
                              : styles.dropdownGridAccessories
                          }
                        >
                          {item.subItems?.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className={styles.dropdownItem}
                              role="menuitem"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className={styles.itemLabel}>{sub.label}</span>
                              <ArrowUpRight size={10} className={styles.itemArrow} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${80 + i * 55}ms` }}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
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
              href="/wishlist"
              className={styles.iconBtn}
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart size={15} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className={styles.cartBadge}>{wishlistCount}</span>
              )}
            </Link>
            {/* Admin Dashboard link - only visible to admin users */}
            {isAdmin && (
              <Link
                href="/admin"
                className={styles.iconBtn}
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
                style={{ fontSize: '10px', letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase', padding: '4px 8px', border: '1px solid currentColor', borderRadius: '4px', lineHeight: 1 }}
              >
                Admin
              </Link>
            )}
            <Link
              href="/profile"
              className={styles.iconBtn}
              aria-label="My profile"
            >
              <UserCircle2 size={15} strokeWidth={1.5} />
            </Link>
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
          <Link href="/home" className={styles.mobileLogoSmall} onClick={() => setMobileOpen(false)} aria-label="Neels Designer Studio — Home">
            <Image
              src="/logo-black.png"
              alt="Neels Designer Studio Logo"
              width={36}
              height={36}
              className={styles.logoImg}
            />
          </Link>
          <button className={styles.iconBtn} onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.mobileNavItems}>
          {NAV_ITEMS.map((item) => {
            const hasSub = Boolean(item.subItems && item.subItems.length > 0);
            const isExpanded = Boolean(mobileExpanded[item.label]);

            if (hasSub) {
              return (
                <div key={item.label} className={styles.mobileNavItemWrapper}>
                  <div
                    className={`${styles.mobileAccordionHeader} ${isExpanded ? styles.mobileAccordionOpen : ''
                      }`}
                  >
                    <Link
                      href={item.href}
                      className={styles.mobileAccordionTitle}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      className={styles.iconBtn}
                      onClick={() => toggleMobileAccordion(item.label)}
                      aria-label={`Toggle ${item.label} options`}
                    >
                      <ChevronDown
                        size={15}
                        className={`${styles.mobileAccordionChevron} ${isExpanded ? styles.chevronOpen : ''
                          }`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className={styles.mobileSubmenu}>
                      {item.subItems?.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className={styles.mobileSubLink}
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileNavLink} ${pathname === item.href ? styles.mobileNavLinkActive : ''
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className={styles.mobileDrawerFooter}>
          <button
            className={styles.mobileUtilLink}
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
          >
            Search
          </button>
          <Link
            href="/wishlist"
            className={styles.mobileUtilLink}
            onClick={() => setMobileOpen(false)}
          >
            Wishlist ({wishlistCount})
          </Link>
          <Link
            href="/cart"
            className={styles.mobileUtilLink}
            onClick={() => setMobileOpen(false)}
          >
            Shopping Bag ({cartCount})
          </Link>
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
