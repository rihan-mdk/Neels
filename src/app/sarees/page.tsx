import type { Metadata } from 'next';
import {
  fetchStorefrontProductsByCategory,
  fetchStorefrontCategory,
} from '@/lib/services/storefront-product.service';
import { getCategoryBySlug } from '@/data/categories';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Sarees',
  description:
    'Heritage weaves and contemporary drapes. Explore Neels Designer Studio sarees — Kanjivaram, tissue, and handwoven silks for every celebration.',
};

export default async function SareesPage() {
  const [category, products] = await Promise.all([
    fetchStorefrontCategory('sarees'),
    fetchStorefrontProductsByCategory('sarees'),
  ]);

  const finalCategory = category ?? getCategoryBySlug('sarees')!;

  return <CategoryPageClient category={finalCategory} products={products} />;
}
