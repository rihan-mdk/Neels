import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const metadata: Metadata = {
  title: 'Sarees',
  description:
    'Heritage weaves and contemporary drapes. Explore Neels Designer Studio sarees — Kanjivaram, tissue, and handwoven silks for every celebration.',
};

export default function SareesPage() {
  const category = getCategoryBySlug('sarees')!;
  const products = getProductsByCategory('sarees');
  return <CategoryPageClient category={category} products={products} />;
}
