import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const metadata: Metadata = {
  title: 'Suits & Dresses',
  description:
    'Refined Indian suits and dresses from Neels Designer Studio — anarkalis, palazzo suits, and contemporary draped ensembles for modern celebrations.',
};

export default function SuitsDressesPage() {
  const category = getCategoryBySlug('suits-dresses')!;
  const products = getProductsByCategory('suits-dresses');
  return <CategoryPageClient category={category} products={products} />;
}
