'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Search, ArrowUpRight, Package } from 'lucide-react';
import { Command } from 'cmdk';
import { searchProducts, Product } from '@/data/products';
import { stopScroll, startScroll } from '@/components/ui/LenisProvider';
import styles from './SearchOverlay.module.css';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_MAP: Record<string, string> = {
  lehengas: 'Lehenga',
  sarees: 'Saree',
  'suits-dresses': 'Suit & Dress',
  jewellery: 'Jewellery',
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Product[]>([]);

  // ── Lock ALL scroll (Lenis + native) when overlay is open ─────────────────
  useEffect(() => {
    if (isOpen) {
      // Stop Lenis smooth scroll engine
      stopScroll();
      // Also lock native scroll as fallback (e.g. iOS Safari momentum)
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // keep scrollbar space to avoid layout shift
    } else {
      // Restore native scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) * -1);
      }
      // Re-enable Lenis
      startScroll();
      // Reset search state
      setQuery('');
      setResults([]);
    }

    return () => {
      // Safety cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      startScroll();
    };
  }, [isOpen]);

  // ── Product search ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchProducts(query));
    } else {
      setResults([]);
    }
  }, [query]);

  // ── Escape to close ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const showProducts = query.trim().length > 1;
  const noResults = showProducts && results.length === 0;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>

        {/* ── Close button ── */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
          <X size={16} strokeWidth={1.5} />
        </button>

        {/* ── Command palette ── */}
        <Command className={styles.command} shouldFilter={false} loop>

          {/* Search input */}
          <div className={styles.inputWrapper}>
            <Search size={15} strokeWidth={1.5} className={styles.searchIcon} aria-hidden="true" />
            <Command.Input
              className={styles.input}
              placeholder="Search lehengas, sarees, collections..."
              value={query}
              onValueChange={setQuery}
              aria-label="Search Neels Designer Studio"
              autoFocus
            />
            {query.length > 0 && (
              <button
                className={styles.clearBtn}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <X size={13} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <Command.List className={styles.list}>

            {/* ── Empty state: no query typed yet ── */}
            {!showProducts && (
              <div className={styles.hint}>
                <Search size={22} strokeWidth={1} className={styles.hintIcon} />
                <p className={styles.hintText}>
                  Begin typing to search across our collections.
                </p>
              </div>
            )}

            {/* ── No results ── */}
            {noResults && (
              <Command.Empty className={styles.empty}>
                <Search size={28} strokeWidth={1} className={styles.emptyIcon} />
                <p className={styles.emptyTitle}>No results for &ldquo;{query}&rdquo;</p>
                <p className={styles.emptyText}>Try a different search term.</p>
              </Command.Empty>
            )}

            {/* ── Product Results ── */}
            {showProducts && results.length > 0 && (
              <Command.Group className={styles.group}>
                <div className={styles.groupHeading}>
                  <Package size={11} strokeWidth={1.5} />
                  Products
                </div>
                <div className={styles.productGrid}>
                  {results.slice(0, 6).map((product) => (
                    <Command.Item
                      key={product.id}
                      value={product.name}
                      onSelect={() => {
                        onClose();
                        window.location.href = `/product/${product.slug}`;
                      }}
                      className={styles.productItem}
                      asChild
                    >
                      <Link href={`/product/${product.slug}`} onClick={onClose} className={styles.productLink}>
                        <div className={styles.productImage}>
                          <Image
                            src={product.images.primary}
                            alt={product.name}
                            fill
                            sizes="72px"
                            className={styles.productImg}
                          />
                        </div>
                        <div className={styles.productInfo}>
                          <span className={styles.productCategory}>
                            {CATEGORY_MAP[product.category] ?? product.category}
                          </span>
                          <span className={styles.productName}>{product.name}</span>
                          <span className={styles.productPrice}>{product.priceFormatted}</span>
                        </div>
                        <ArrowUpRight size={12} className={styles.productArrow} />
                      </Link>
                    </Command.Item>
                  ))}
                </div>
                {results.length > 6 && (
                  <Link
                    href={`/collections?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className={styles.viewAll}
                  >
                    View all {results.length} results
                    <ArrowUpRight size={11} />
                  </Link>
                )}
              </Command.Group>
            )}
          </Command.List>
        </Command>

        {/* ── Footer hint ── */}
        <div className={styles.footer}>
          <span className={styles.kbd}>↑↓</span>
          <span className={styles.footerHint}>navigate</span>
          <span className={styles.kbd}>↵</span>
          <span className={styles.footerHint}>select</span>
          <span className={styles.kbd}>Esc</span>
          <span className={styles.footerHint}>close</span>
        </div>

      </div>
    </div>
  );
}
