'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.wrapper}>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbs} role="list">
          {images.map((src, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${active === i ? styles.thumbActive : ''}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={active === i}
              role="listitem"
            >
              <Image
                src={src}
                alt={`${productName} — view ${i + 1}`}
                fill
                sizes="80px"
                className={styles.thumbImg}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className={styles.main}>
        <div className={styles.mainImage}>
          <Image
            src={images[active]}
            alt={`${productName} — image ${active + 1}`}
            fill
            priority={active === 0}
            sizes="(max-width: 768px) 100vw, 55vw"
            className={styles.mainImg}
          />
        </div>
      </div>
    </div>
  );
}
