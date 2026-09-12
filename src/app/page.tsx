import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import FeaturedStory from '@/components/home/FeaturedStory';
import CuratedCategories from '@/components/home/CuratedCategories';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import CoutureProcess from '@/components/home/CoutureProcess';
import BrandStatement from '@/components/home/BrandStatement';
import VisualJournal from '@/components/home/VisualJournal';
import ProductGrid from '@/components/products/ProductGrid';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getFeaturedProducts } from '@/data/products';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Neels Designer Studio — Contemporary Indian Couture',
  description:
    'Discover Neels Designer Studio, a contemporary Indian couture house creating timeless silhouettes through heritage craftsmanship and modern design.',
};

export default function HomePage() {
  const featured = getFeaturedProducts(8);

  return (
    <>
      <Hero />
      <FeaturedStory />
      <CuratedCategories />
      <FeaturedCollections />

      {/* Featured Products */}
      <section className={styles.featuredProducts}>
        <div className={styles.inner}>
          <ScrollReveal>
            <SectionHeading
              title="Selected Pieces"
              subtitle="A curated selection from our current collections."
              centered
            />
          </ScrollReveal>
          <ProductGrid products={featured} columns={4} />
        </div>
      </section>

      <CoutureProcess />
      <BrandStatement />
      <VisualJournal />
    </>
  );
}
