import { NextRequest, NextResponse } from 'next/server';
import { searchStorefrontProducts } from '@/lib/services/storefront-product.service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ products: [] });
  }

  const products = await searchStorefrontProducts(q);
  return NextResponse.json({ products });
}
