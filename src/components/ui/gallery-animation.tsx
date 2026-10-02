'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './gallery-animation.module.css';

export interface ExpandableGalleryProps {
  images: string[];
  className?: string;
  style?: React.CSSProperties;
}

export const ExpandableGallery: React.FC<ExpandableGalleryProps> = ({
  images,
  className = '',
  style,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const getFlexValue = (index: number) => {
    if (hoveredIndex === null) {
      return 1;
    }
    return hoveredIndex === index ? 2.2 : 0.6;
  };

  return (
    <div className={`${styles.galleryWrapper} ${className}`} style={style}>
      {/* Horizontal Expandable Gallery */}
      <div className={styles.galleryTrack}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={styles.galleryItem}
            style={{ flex: 1 }}
            animate={{ flex: getFlexValue(index) }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => openImage(index)}
            title="Click to view full attire"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`Neels Couture Piece ${index + 1}`}
              className={styles.galleryImage}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === null ? 0 : hoveredIndex === index ? 0 : 0.45 }}
              transition={{ duration: 0.3 }}
            />
            <div className={styles.itemHint}>View Piece</div>
          </motion.div>
        ))}
      </div>

      {/* Expanded View Modal / Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={closeImage}
          >
            {/* Close Button */}
            <button
              className={styles.closeButton}
              onClick={closeImage}
              aria-label="Close image preview"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={goToPrev}
                aria-label="Previous image"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image Container */}
            <motion.div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt={`Neels Couture Piece ${selectedIndex + 1}`}
                className={styles.modalImage}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={goToNext}
                aria-label="Next image"
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            <div className={styles.imageCounter}>
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableGallery;

// Export Component for demo compatibility
export function Component() {
  const images = [
    '/hero-gallery-1.jpeg',
    '/hero-gallery-2.jpeg',
    '/hero-gallery-3.jpeg',
    '/hero-gallery-4.jpeg',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <ExpandableGallery images={images} style={{ width: '80%', maxWidth: '1200px' } as any} />
    </div>
  );
}
