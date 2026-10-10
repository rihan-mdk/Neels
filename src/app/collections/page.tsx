import type { Metadata } from 'next';
import {
  fetchStorefrontProducts,
  fetchStorefrontProductsByCategory,
  searchStorefrontProducts,
  fetchStorefrontCategory,
} from '@/lib/services/storefront-product.service';
import { getCategoryBySlug } from '@/data/categories';
import CategoryPageClient from '@/components/editorial/CategoryPageClient';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Collection — Neels Designer Studio',
  description:
    'Explore the ready-to-wear and couture collections from Neels Designer Studio — Korean styles, short kurtis, Pakistani silhouettes, gowns, party wear, co-ord sets, and bespoke designs.',
};

interface Props {
  searchParams?: Promise<{ category?: string; search?: string }>;
}

export default async function CollectionsPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const [baseCategory, products] = await Promise.all([
    fetchStorefrontCategory('collections'),
    params.category
      ? fetchStorefrontProductsByCategory(params.category)
      : params.search
      ? searchStorefrontProducts(params.search)
      : fetchStorefrontProducts(),
  ]);

  const fallback = getCategoryBySlug('collections') ?? getCategoryBySlug('suits-dresses')!;
  const category = baseCategory ?? fallback;

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
