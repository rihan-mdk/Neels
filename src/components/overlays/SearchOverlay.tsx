'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Search } from 'lucide-react';
import { searchProducts, Product } from '@/data/products';
import styles from './SearchOverlay.module.css';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchProducts(query));
    } else {
      setResults([]);
    }
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.searchRow}>
            <Search size={16} strokeWidth={1.5} className={styles.searchIcon} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lehengas, sarees, collections..."
              className={styles.input}
              aria-label="Search Neels Designer Studio"
              autoComplete="off"
            />
            <button
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close search"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
          <h2 className={styles.title}>Search Neels</h2>
        </div>

        <div className={styles.results}>
          {query.trim().length > 1 && results.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No Results Found</p>
              <p className={styles.emptyText}>Try another search.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className={styles.resultGrid}>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className={styles.resultItem}
                >
                  <div className={styles.resultImage}>
                    <Image
                      src={product.images.primary}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className={styles.resultImg}
                    />
                  </div>
                  <div className={styles.resultInfo}>
                    <span className={styles.resultBrand}>Neels</span>
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultCategory}>
                      {product.category.replace('-', ' & ')}
                    </span>
                    <span className={styles.resultPrice}>{product.priceFormatted}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query.trim().length <= 1 && (
            <div className={styles.hint}>
              <p className={styles.hintText}>
                Begin typing to search across our collections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
