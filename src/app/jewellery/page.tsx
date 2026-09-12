import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/data/categories';
import { getProductsByCategory } from '@/data/products';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const metadata: Metadata = {
  title: 'Accessories',
  description:
    'Discover Neels Designer Studio fine jewellery and accessories — kundan chokers, polki necklaces, diamond rings and 22-karat gold bangles. Heirloom craftsmanship for extraordinary moments.',
};

export default function JewelleryPage() {
  const category = getCategoryBySlug('jewellery')!;
  const products = getProductsByCategory('jewellery');
  return <CategoryPageClient category={category} products={products} />;
}
