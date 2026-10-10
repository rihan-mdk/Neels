import type { Metadata } from 'next';
import {
  fetchStorefrontProductsByCategory,
  fetchStorefrontCategory,
} from '@/lib/services/storefront-product.service';
import { getCategoryBySlug } from '@/data/categories';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Accessories',
  description:
    'Discover Neels Designer Studio fine jewellery and accessories — kundan chokers, polki necklaces, diamond rings and 22-karat gold bangles. Heirloom craftsmanship for extraordinary moments.',
};

export default async function JewelleryPage() {
  const [category, products] = await Promise.all([
    fetchStorefrontCategory('jewellery'),
    fetchStorefrontProductsByCategory('jewellery'),
  ]);

  const finalCategory = category ?? getCategoryBySlug('jewellery')!;

  return <CategoryPageClient category={finalCategory} products={products} />;
}
