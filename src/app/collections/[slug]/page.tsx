import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS, getCollectionBySlug } from '@/data/collections';
import { getProductsByCollection } from '@/data/products';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/products/ProductGrid';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.longDescription,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(slug);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroSeason}>{collection.season}</p>
          <h1 className={styles.heroTitle}>{collection.name}</h1>
        </div>
      </div>

      <div className={styles.inner}>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: collection.name },
          ]}
        />

        <ScrollReveal>
          <div className={styles.about}>
            <p className={styles.aboutText}>{collection.longDescription}</p>
          </div>
        </ScrollReveal>

        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              This collection is arriving soon. Explore our other collections in the meantime.
            </p>
            <Link href="/collections" className="btn btn-secondary">
              View All Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
