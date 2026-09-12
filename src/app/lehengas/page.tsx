import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const metadata: Metadata = {
  title: 'Lehengas',
  description:
    'Contemporary lehenga silhouettes enriched with intricate craftsmanship. Explore Neels Designer Studio lehengas for weddings and celebrations.',
};

export default function LehengasPage() {
  const category = getCategoryBySlug('lehengas')!;
  const products = getProductsByCategory('lehengas');
  return <CategoryPageClient category={category} products={products} />;
}
