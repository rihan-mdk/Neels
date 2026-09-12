'use client';

import React from 'react';
import { ProductSize } from '@/data/products';
import styles from './SizeSelector.module.css';

interface SizeSelectorProps {
  sizes: ProductSize[];
  selected: ProductSize | null;
  onSelect: (size: ProductSize) => void;
  onCustomSize?: () => void;
}

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  onCustomSize,
}: SizeSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Size</span>
        <button
          type="button"
          className={styles.guideLink}
          onClick={onCustomSize}
        >
          Size Guide
        </button>
      </div>
      <div className={styles.options} role="group" aria-label="Select size">
        {sizes.map((size) => {
          const isCustom = size === 'CUSTOM SIZE';
          return (
            <button
              key={size}
              type="button"
              className={`${styles.option} ${selected === size ? styles.optionSelected : ''} ${isCustom ? styles.optionCustom : ''}`}
              onClick={() => {
                if (isCustom && onCustomSize) {
                  onCustomSize();
                } else {
                  onSelect(size);
                }
              }}
              aria-pressed={selected === size}
            >
              {isCustom ? 'Custom' : size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
