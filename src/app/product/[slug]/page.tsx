import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  fetchStorefrontProductBySlug,
  fetchStorefrontProductsByCategory,
  fetchStorefrontProducts,
} from '@/lib/services/storefront-product.service';
import ProductDetailClient from './ProductDetail';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await fetchStorefrontProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchStorefrontProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — NEELSH`,
      description: product.description,
      images: [{ url: product.images.primary }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchStorefrontProductBySlug(slug);
  if (!product) notFound();

  const categoryProducts = await fetchStorefrontProductsByCategory(product.category);
  let related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // If few items in same category, supplement with other active products
  if (related.length < 4) {
    const allProducts = await fetchStorefrontProducts();
    const moreRelated = allProducts
      .filter((p) => p.id !== product.id && !related.some((r) => r.id === p.id))
      .slice(0, 4 - related.length);
    related = [...related, ...moreRelated];
  }

  return <ProductDetailClient product={product} related={related} />;
}
