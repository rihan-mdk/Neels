'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Search,
  ArrowUpRight,
  ArrowLeft,
  ChevronRight,
  Package,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
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

const POPULAR_SEARCHES = [
  'Lehenga',
  'Pakistani',
  'Korean',
  'Party Wear',
  'Co-ord Set',
  'Bridal',
  'Saree',
];

const SEARCH_COLLECTIONS = [
  { name: 'The Heritage Edit', href: '/collections/the-heritage-edit', type: 'Collection' },
  { name: 'The Bridal Couture', href: '/collections/the-bridal-couture', type: 'Collection' },
  { name: 'Lehengas', href: '/lehengas', type: 'Category' },
  { name: 'Sarees', href: '/sarees', type: 'Category' },
  { name: 'Suits & Dresses', href: '/suits-dresses', type: 'Category' },
  { name: 'Festive Edit', href: '/collections?search=festive', type: 'Collection' },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const mobileRootRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  // ── Scroll lock: stop Lenis + freeze body ──────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // 1. Stop Lenis smooth scroll engine
      stopScroll();
      // 2. Freeze native body scroll (saves position to restore on close)
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';

      // Auto-focus mobile input smoothly once overlay opens
      const focusTimer = setTimeout(() => {
        if (window.innerWidth <= 768 && mobileInputRef.current) {
          mobileInputRef.current.focus();
        }
      }, 80);

      return () => clearTimeout(focusTimer);
    } else {
      // Restore body scroll position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollYRef.current);
      // Re-enable Lenis
      startScroll();
      // Reset search state
      setQuery('');
      setResults([]);
    }

    return () => {
      // Safety cleanup if component unmounts while open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      startScroll();
    };
  }, [isOpen]);

  // ── Dynamic visualViewport tracking for mobile virtual keyboards ───────────
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      if (window.innerWidth <= 768 && mobileRootRef.current) {
        mobileRootRef.current.style.height = `${vv.height}px`;
      }
    };

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
    handleResize();

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  // ── Block wheel scroll on backdrop (but NOT on the panel) ─────────────────
  useEffect(() => {
    const el = backdropRef.current;
    if (!el || !isOpen) return;

    const blockWheel = (e: WheelEvent) => {
      if (e.target === el) {
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', blockWheel, { passive: false });
    return () => el.removeEventListener('wheel', blockWheel);
  }, [isOpen]);

  // ── Product search ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (query.trim().length > 0) {
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

  const showProducts = query.trim().length > 0;
  const noResults = showProducts && results.length === 0;

  // Filter matching collections for mobile live suggestions (max 2-3)
  const matchedCollections = showProducts
    ? SEARCH_COLLECTIONS.filter((col) =>
        col.name.toLowerCase().includes(query.toLowerCase().trim())
      ).slice(0, 3)
    : [];

  // Limit mobile products to 3–5 compact horizontal rows
  const mobileProducts = results.slice(0, 5);

  const handleMobileClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
    mobileInputRef.current?.focus();
  };

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    mobileInputRef.current?.focus();
  };

  const handleMobileScroll = () => {
    // Naturally dismiss keyboard when user starts scrolling the results list
    if (document.activeElement === mobileInputRef.current) {
      mobileInputRef.current?.blur();
    }
  };

  return (
    <>
      {/* ────────────────────────────────────────────────
          DESKTOP SEARCH PALETTE — 100% UNTOUCHED
          (Rendered and styled exactly as before)
      ──────────────────────────────────────────────── */}
      <div className={styles.desktopWrapper}>
        <div
          ref={backdropRef}
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className={styles.panel}>

            {/* Close button */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
              <X size={16} strokeWidth={1.5} />
            </button>

            {/* Command palette */}
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

              {/* Scrollable list wrapper */}
              <div className={styles.listScroll} data-lenis-prevent>
                <Command.List className={styles.list}>

                  {/* Empty state: no query typed yet */}
                  {!showProducts && (
                    <div className={styles.hint}>
                      <Search size={22} strokeWidth={1} className={styles.hintIcon} />
                      <p className={styles.hintText}>
                        Begin typing to search across our collections.
                      </p>
                    </div>
                  )}

                  {/* No results */}
                  {noResults && (
                    <Command.Empty className={styles.empty}>
                      <Search size={28} strokeWidth={1} className={styles.emptyIcon} />
                      <p className={styles.emptyTitle}>No results for &ldquo;{query}&rdquo;</p>
                      <p className={styles.emptyText}>Try a different search term.</p>
                    </Command.Empty>
                  )}

                  {/* Product Results */}
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
              </div>
            </Command>

          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          DEDICATED FULL-SCREEN MOBILE SEARCH INTERFACE
          (Strictly mobile-only, ≤ 768px, 100dvh, uncluttered)
      ──────────────────────────────────────────────── */}
      <div
        ref={mobileRootRef}
        id="mobile-search-root"
        className={styles.mSearchOverlay}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* ── TOP MOBILE SEARCH BAR ── */}
        <div className={styles.mTopBar}>
          <button
            type="button"
            className={styles.mBackBtn}
            onClick={onClose}
            aria-label="Close search and return"
          >
            <ArrowLeft size={22} strokeWidth={1.5} color="#181515" />
          </button>

          <div className={styles.mSearchPill}>
            <Search size={18} strokeWidth={1.5} color="#181515" className={styles.mSearchIcon} />
            <input
              ref={mobileInputRef}
              type="text"
              inputMode="search"
              className={styles.mInput}
              placeholder="Search collections, styles & more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search collections, styles & more"
              autoFocus
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {query.length > 0 && (
              <button
                type="button"
                className={styles.mClearBtn}
                onClick={handleMobileClear}
                aria-label="Clear search text"
              >
                <X size={15} strokeWidth={1.8} color="#181515" />
              </button>
            )}
          </div>
        </div>

        {/* ── SCROLLABLE MOBILE CONTENT AREA ── */}
        <div
          className={styles.mScrollArea}
          onScroll={handleMobileScroll}
          data-lenis-prevent
        >
          {/* STATE 1: BEFORE TYPING — Popular Searches & Quick Collections */}
          {!showProducts && (
            <div className={styles.mInitialState}>
              <div className={styles.mSection}>
                <div className={styles.mSectionTitleRow}>
                  <TrendingUp size={13} color="#B57A7A" />
                  <span className={styles.mSectionHeading}>Popular Searches</span>
                </div>
                <div className={styles.mChipsWrap}>
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={styles.mSearchChip}
                      onClick={() => handleSelectQuery(term)}
                    >
                      <Search size={12} color="#B57A7A" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.mSection} style={{ marginTop: '24px' }}>
                <div className={styles.mSectionTitleRow}>
                  <Sparkles size={13} color="#B57A7A" />
                  <span className={styles.mSectionHeading}>Curated Collections</span>
                </div>
                <div className={styles.mCollectionsList}>
                  {SEARCH_COLLECTIONS.slice(0, 4).map((col) => (
                    <Link
                      key={col.name}
                      href={col.href}
                      onClick={onClose}
                      className={styles.mCollectionRow}
                    >
                      <div className={styles.mCollectionLeft}>
                        <Layers size={14} color="#B57A7A" />
                        <span className={styles.mCollectionName}>{col.name}</span>
                      </div>
                      <ChevronRight size={16} color="#B57A7A" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: WHILE TYPING — Collections & Compact Products */}
          {showProducts && (
            <div className={styles.mResultsState}>

              {/* Matching Collections Suggestions (if any) */}
              {matchedCollections.length > 0 && (
                <div className={styles.mSection} style={{ marginBottom: '18px' }}>
                  <span className={styles.mSectionHeading}>Collections</span>
                  <div className={styles.mCollectionsList} style={{ marginTop: '8px' }}>
                    {matchedCollections.map((col) => (
                      <Link
                        key={col.name}
                        href={col.href}
                        onClick={onClose}
                        className={styles.mCollectionRow}
                      >
                        <div className={styles.mCollectionLeft}>
                          <span className={styles.mCollectionHighlight}>{col.name}</span>
                          <span className={styles.mCollectionType}>{col.type}</span>
                        </div>
                        <ChevronRight size={16} color="#B57A7A" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Results: 3–5 compact horizontal rows */}
              {mobileProducts.length > 0 && (
                <div className={styles.mSection}>
                  <div className={styles.mSectionTitleRow}>
                    <Package size={13} color="#B57A7A" />
                    <span className={styles.mSectionHeading}>Products</span>
                  </div>

                  <div className={styles.mProductsList}>
                    {mobileProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        className={styles.mProductRow}
                      >
                        <div className={styles.mProductThumb}>
                          <Image
                            src={p.images.primary}
                            alt={p.name}
                            fill
                            sizes="60px"
                            className={styles.mProductImg}
                          />
                        </div>
                        <div className={styles.mProductDetails}>
                          <p className={styles.mProductName}>{p.name}</p>
                          <p className={styles.mProductSub}>
                            {CATEGORY_MAP[p.category] ?? p.category} · {p.priceFormatted}
                          </p>
                        </div>
                        <ChevronRight size={16} color="#B57A7A" className={styles.mProductArrow} />
                      </Link>
                    ))}
                  </div>

                  {/* View All Results Button */}
                  <Link
                    href={`/collections?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className={styles.mViewAllBtn}
                  >
                    <span>View All Results ({results.length})</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}

              {/* No Results Fallback */}
              {noResults && (
                <div className={styles.mEmptyState}>
                  <Search size={26} color="#B57A7A" className={styles.mEmptyIcon} />
                  <p className={styles.mEmptyTitle}>No results for &ldquo;{query}&rdquo;</p>
                  <p className={styles.mEmptyDesc}>
                    Try searching for bridal lehengas, organza sarees, or festive edit.
                  </p>
                  <div className={styles.mEmptySuggestions}>
                    <button
                      type="button"
                      className={styles.mSearchChip}
                      onClick={() => handleSelectQuery('Lehenga')}
                    >
                      Lehenga
                    </button>
                    <button
                      type="button"
                      className={styles.mSearchChip}
                      onClick={() => handleSelectQuery('Saree')}
                    >
                      Saree
                    </button>
                    <button
                      type="button"
                      className={styles.mSearchChip}
                      onClick={() => handleSelectQuery('Ivory')}
                    >
                      Ivory
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
