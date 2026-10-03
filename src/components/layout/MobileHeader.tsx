'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchOverlay from '@/components/overlays/SearchOverlay';

/**
 * MobileHeader — shown ONLY on mobile (≤ 768px)
 * Desktop header remains completely untouched.
 *
 * Layout:
 *   [ empty left ] [ NEEL'S centered ] [ Search | Cart right ]
 */
export default function MobileHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Visible only on mobile — transparent and sticky */}
      <header
        className="md:hidden"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: 60,
          backgroundColor: scrolled ? 'rgba(255, 253, 252, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(220, 207, 200, 0.5)' : 'none',
          transition: 'background-color 220ms ease, border-color 220ms ease, backdrop-filter 220ms ease',
        }}
      >
        {/* Three-column grid: empty | brand | icons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: '100%',
            paddingLeft: 18,
            paddingRight: 18,
          }}
        >
          {/* LEFT — intentionally empty for visual balance */}
          <div />

          {/* CENTER — Brand wordmark, absolutely centered */}
          <Link
            href="/"
            aria-label="Neel's Designer Studio — Home"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif, "Cormorant Garamond", Georgia, serif)',
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: '0.30em',
                textTransform: 'uppercase',
                color: '#181515',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              Neel&rsquo;s
            </span>
          </Link>

          {/* RIGHT — Search + Cart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 14,
            }}
          >
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                color: '#181515',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#181515',
                textDecoration: 'none',
                padding: 6,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    minWidth: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: '#B57A7A',
                    color: '#FFFDFC',
                    fontSize: 8,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    padding: '0 3px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
