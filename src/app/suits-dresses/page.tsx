import type { Metadata } from 'next';
import {
  fetchStorefrontProductsByCategory,
  fetchStorefrontCategory,
} from '@/lib/services/storefront-product.service';
import { getCategoryBySlug } from '@/data/categories';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Suits & Dresses',
  description:
    'Refined Indian silhouettes and contemporary ready-to-wear for celebrations — from anarkalis to palazzo suits to draped ensembles.',
};

export default async function SuitsDressesPage() {
  const [category, products] = await Promise.all([
    fetchStorefrontCategory('suits-dresses'),
    fetchStorefrontProductsByCategory('suits-dresses'),
  ]);

  const fallback = getCategoryBySlug('collections') ?? getCategoryBySlug('suits-dresses')!;
  const finalCategory = category ?? fallback;

  return <CategoryPageClient category={finalCategory} products={products} />;
}
