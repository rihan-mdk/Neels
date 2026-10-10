import {
  fetchStorefrontFeaturedProducts,
  fetchStorefrontNewArrivals,
} from '@/lib/services/storefront-product.service';
import HomePageClient from '@/components/home/HomePageClient';

export const revalidate = 0;

export default async function RootHomePage() {
  const [featured, newArrivals] = await Promise.all([
    fetchStorefrontFeaturedProducts(8),
    fetchStorefrontNewArrivals(8),
  ]);

  return <HomePageClient featured={featured} newArrivals={newArrivals} />;
}
