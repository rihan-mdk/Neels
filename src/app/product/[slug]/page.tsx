import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProductBySlug, getProductsByCategory } from '@/data/products';
import ProductDetailClient from './ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const categoryProducts = getProductsByCategory(product.category);
  const related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
