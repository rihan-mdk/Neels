import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const metadata: Metadata = {
  title: 'Collection — Neels Designer Studio',
  description:
    'Explore the ready-to-wear and couture collections from Neels Designer Studio — Korean styles, short kurtis, Pakistani silhouettes, gowns, party wear, co-ord sets, and bespoke designs.',
};

export default function CollectionsPage() {
  const category = getCategoryBySlug('collections') ?? getCategoryBySlug('suits-dresses')!;
  const products = getProductsByCategory('suits-dresses');
  return (
    <CategoryPageClient
      category={{
        ...category,
        name: 'Collection',
        pluralName: 'Collections',
        path: '/collections',
      }}
      products={products}
    />
  );
}
