import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HorizontalScrollSection from '@/components/ui/HorizontalScrollSection';
import styles from './CuratedCategories.module.css';

interface CuratedCardItem {
  id: string;
  name: string;
  path: string;
  description: string;
  image: string;
}

const CURATED_CATEGORIES: CuratedCardItem[] = [
  {
    id: 'curated-lehengas',
    name: 'Bridal Lehengas',
    path: '/lehengas',
    description: 'Heirloom zardozi, raw silk & hand-embroidered silhouettes crafted for royal celebrations.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'curated-sarees',
    name: 'Fine Sarees',
    path: '/sarees',
    description: 'Handwoven tissue silks, organza and banarasi drapes with artisanal gold borders.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'curated-suits',
    name: 'Suits & Anarkalis',
    path: '/suits-dresses',
    description: 'Refined tailoring and fluid draped ensembles designed for modern festive elegance.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'curated-accessories',
    name: 'Fine Accessories',
    path: '/jewellery',
    description: 'Kundan chokers, polki necklaces and 22-karat gold rings crafted by master goldsmiths.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'curated-couture',
    name: 'Bespoke Couture',
    path: '/couture',
    description: 'One-of-a-kind masterpieces made to measure with personalised embroidery narratives.',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'curated-heirloom',
    name: 'Heirloom Jewellery',
    path: '/jewellery',
    description: 'Intricate temple bangles, polki jhumkas and statement cocktail pieces that endure.',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'curated-evening',
    name: 'Evening & Occasion',
    path: '/collections',
    description: 'Contemporary sculptural cuts blended with the opulent romance of Indian textiles.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  },
];

export default function CuratedCategories() {
  return (
    <HorizontalScrollSection
      eyebrow="The Atelier"
      title="Curated Categories"
      subtitle="From royal bridal lehengas to bespoke accessories and fine tailoring."
    >
      {CURATED_CATEGORIES.map((cat) => (
        <Link key={cat.id} href={cat.path} className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 75vw, 380px"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.overlay} aria-hidden="true" />
            <div className={styles.cardContent}>
              <h3 className={styles.categoryName}>{cat.name}</h3>
              <p className={styles.categoryDesc}>{cat.description}</p>
              <span className={styles.exploreLink}>
                Explore Category
                <span className={styles.arrow} aria-hidden="true"> →</span>
              </span>
            </div>
          </div>
        </Link>
      ))}
    </HorizontalScrollSection>
  );
}
