import type { Metadata } from 'next';
import {
  fetchStorefrontProductsByCategory,
  fetchStorefrontCategory,
} from '@/lib/services/storefront-product.service';
import { getCategoryBySlug } from '@/data/categories';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Lehengas',
  description:
    'Contemporary lehenga silhouettes enriched with intricate craftsmanship. Explore Neels Designer Studio lehengas for weddings and celebrations.',
};

export default async function LehengasPage() {
  const [category, products] = await Promise.all([
    fetchStorefrontCategory('lehengas'),
    fetchStorefrontProductsByCategory('lehengas'),
  ]);

  const finalCategory = category ?? getCategoryBySlug('lehengas')!;

  return <CategoryPageClient category={finalCategory} products={products} />;
}
