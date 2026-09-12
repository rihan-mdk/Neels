import React from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  small?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  light = false,
  small = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`${styles.wrapper} ${centered ? styles.centered : ''} ${light ? styles.light : ''}`}
    >
      <h2 className={`${styles.title} ${small ? styles.titleSmall : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={styles.subtitle}>{subtitle}</p>
      )}
    </div>
  );
}
