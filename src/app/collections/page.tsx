import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/data/collections';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Explore all Neels Designer Studio collections — The Heritage Edit, The Signature Edit, The Artisan Series, and The Bridal Couture.',
};

export default function CollectionsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <ScrollReveal>
          <SectionHeading
            title="The Collections"
            subtitle="Four distinct expressions of the Neels Designer Studio design philosophy — each rooted in heritage, shaped by a contemporary eye."
            centered
          />
        </ScrollReveal>
      </div>

      <div className={styles.inner}>
        {COLLECTIONS.map((col, i) => (
          <ScrollReveal key={col.id}>
            <Link href={`/collections/${col.slug}`} className={`${styles.collection} ${i % 2 !== 0 ? styles.reversed : ''}`}>
              <div className={styles.imageWrapper}>
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className={styles.image}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
              <div className={styles.info}>
                <span className={styles.season}>{col.season}</span>
                <h2 className={styles.name}>{col.name}</h2>
                <p className={styles.desc}>{col.longDescription}</p>
                <span className="btn btn-secondary">Explore Collection</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
