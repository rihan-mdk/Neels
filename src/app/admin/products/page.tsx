import React from 'react';
import { createClient } from '@/lib/supabase/server';
import ProductManager from '@/components/admin/products/ProductManager';
import { PaginatedProductsResult, ProductRecord } from '@/lib/validations/product.schema';

export const revalidate = 0;

const PAGE_SIZE = 10;

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // 1. SSR-prefetch page 1 of products (created_at DESC)
  const { data: products, count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const totalCount = count ?? 0;
  const initialResult: PaginatedProductsResult = {
    products: (products || []) as ProductRecord[],
    totalCount,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(totalCount / PAGE_SIZE) || 1,
  };

  // 2. Prefetch categories and collections for dropdowns
  const [{ data: categories }, { data: collections }] = await Promise.all([
    supabase
      .from('categories')
      .select('slug, name')
      .order('display_order', { ascending: true }),
    supabase
      .from('collections')
      .select('slug, name')
      .order('display_order', { ascending: true }),
  ]);

  return (
    <ProductManager
      initialResult={initialResult}
      categories={(categories || []) as { slug: string; name: string }[]}
      collections={(collections || []) as { slug: string; name: string }[]}
    />
  );
}
