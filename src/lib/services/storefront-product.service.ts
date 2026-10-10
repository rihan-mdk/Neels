import { createClient } from '@supabase/supabase-js';
import { Product, ProductCategory, ProductSize } from '@/data/products';
import { Category, getCategoryBySlug } from '@/data/categories';
import { Collection, getCollectionBySlug } from '@/data/collections';

// ============================================================
// SUPABASE STOREFRONT PRODUCT SERVICE
// Dedicated server-side service for live customer-facing catalog
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getStorefrontClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export interface SupabaseProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_slug: string;
  collection_slug: string | null;
  price: number | null;
  price_formatted: string;
  image_primary: string;
  image_hover: string | null;
  image_gallery: string[];
  sizes: string[];
  description: string;
  details: string[];
  fabric: string;
  care: string;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  collections?: { name: string } | null;
}

export interface SupabaseCategoryRow {
  slug: string;
  name: string;
  plural_name: string;
  path: string;
  description: string;
  editorial_description: string;
  image: string;
  display_order: number;
}

export interface SupabaseCollectionRow {
  slug: string;
  name: string;
  short_name: string;
  season: string | null;
  description: string;
  long_description: string;
  image: string;
  display_order: number;
}

/**
 * Maps Supabase raw product row to the storefront Product interface
 */
export function mapSupabaseToProduct(row: SupabaseProductRow): Product {
  const collectionName = row.collections?.name || undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand || 'Neels',
    category: row.category_slug as ProductCategory,
    collection: collectionName,
    collectionSlug: row.collection_slug || undefined,
    price: row.price,
    priceFormatted:
      row.price_formatted ||
      (row.price !== null ? `₹${row.price.toLocaleString('en-IN')}` : 'PRICE ON REQUEST'),
    images: {
      primary: row.image_primary,
      hover: row.image_hover || undefined,
      gallery:
        row.image_gallery && row.image_gallery.length > 0
          ? row.image_gallery
          : [row.image_primary],
    },
    sizes: (row.sizes && row.sizes.length > 0
      ? row.sizes
      : ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE']) as ProductSize[],
    description: row.description || '',
    details: Array.isArray(row.details) ? row.details : [],
    fabric: row.fabric || '',
    care: row.care || '',
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
  };
}

/**
 * Maps Supabase raw category row to the storefront Category interface
 */
export function mapSupabaseToCategory(row: SupabaseCategoryRow): Category {
  return {
    id: `cat-${row.slug}`,
    slug: row.slug,
    name: row.name,
    pluralName: row.plural_name,
    path: row.path.startsWith('/') ? row.path : `/${row.slug}`,
    description: row.description || '',
    editorialDescription: row.editorial_description || '',
    image: row.image,
    category: row.slug as ProductCategory,
  };
}

/**
 * Maps Supabase raw collection row to the storefront Collection interface
 */
export function mapSupabaseToCollection(row: SupabaseCollectionRow): Collection {
  return {
    id: `col-${row.slug}`,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name || row.name,
    season: row.season || 'Perennial',
    description: row.description || '',
    longDescription: row.long_description || row.description || '',
    image: row.image,
  };
}

/**
 * Fetches all active products from Supabase
 */
export async function fetchStorefrontProducts(): Promise<Product[]> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching storefront products:', error.message);
      return [];
    }

    return (data || []).map((row) => mapSupabaseToProduct(row as unknown as SupabaseProductRow));
  } catch (err) {
    console.error('Failed to fetch storefront products:', err);
    return [];
  }
}

/**
 * Fetches a single active product by its URL slug
 */
export async function fetchStorefrontProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error(`Error fetching product by slug ${slug}:`, error.message);
      }
      return null;
    }

    return mapSupabaseToProduct(data as unknown as SupabaseProductRow);
  } catch (err) {
    console.error(`Failed to fetch product by slug ${slug}:`, err);
    return null;
  }
}

/**
 * Fetches active products by category slug
 */
export async function fetchStorefrontProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('category_slug', categorySlug)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching products for category ${categorySlug}:`, error.message);
      return [];
    }

    return (data || []).map((row) => mapSupabaseToProduct(row as unknown as SupabaseProductRow));
  } catch (err) {
    console.error(`Failed to fetch products for category ${categorySlug}:`, err);
    return [];
  }
}

/**
 * Fetches active products belonging to a collection
 */
export async function fetchStorefrontProductsByCollection(
  collectionSlug: string
): Promise<Product[]> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('collection_slug', collectionSlug)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching products for collection ${collectionSlug}:`, error.message);
      return [];
    }

    return (data || []).map((row) => mapSupabaseToProduct(row as unknown as SupabaseProductRow));
  } catch (err) {
    console.error(`Failed to fetch products for collection ${collectionSlug}:`, err);
    return [];
  }
}

/**
 * Fetches featured products for the storefront homepage / curation sections
 */
export async function fetchStorefrontFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching featured products:', error.message);
      return [];
    }

    const featured = (data || []).map((row) =>
      mapSupabaseToProduct(row as unknown as SupabaseProductRow)
    );

    // If fewer featured than limit, fill with latest active products to keep rich editorial UI
    if (featured.length < limit) {
      const remainingLimit = limit - featured.length;
      const featuredIds = featured.map((p) => p.id);

      let query = supabase
        .from('products')
        .select('*, collections(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(remainingLimit);

      if (featuredIds.length > 0) {
        query = query.not('id', 'in', `(${featuredIds.join(',')})`);
      }

      const { data: moreData } = await query;
      if (moreData && moreData.length > 0) {
        const additional = moreData.map((row) =>
          mapSupabaseToProduct(row as unknown as SupabaseProductRow)
        );
        return [...featured, ...additional];
      }
    }

    return featured;
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
    return [];
  }
}

/**
 * Fetches new arrival products for the storefront
 */
export async function fetchStorefrontNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('is_new', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching new arrivals:', error.message);
      return [];
    }

    const newItems = (data || []).map((row) =>
      mapSupabaseToProduct(row as unknown as SupabaseProductRow)
    );

    if (newItems.length >= limit) {
      return newItems;
    }

    const remainingLimit = limit - newItems.length;
    const existingIds = newItems.map((p) => p.id);

    let query = supabase
      .from('products')
      .select('*, collections(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(remainingLimit);

    if (existingIds.length > 0) {
      query = query.not('id', 'in', `(${existingIds.join(',')})`);
    }

    const { data: moreData } = await query;
    if (moreData && moreData.length > 0) {
      const additional = moreData.map((row) =>
        mapSupabaseToProduct(row as unknown as SupabaseProductRow)
      );
      return [...newItems, ...additional];
    }

    return newItems;
  } catch (err) {
    console.error('Failed to fetch new arrivals:', err);
    return [];
  }
}

/**
 * Searches active products by query across name, slug, fabric, description, category
 */
export async function searchStorefrontProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, collections(name)')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,slug.ilike.%${q}%,fabric.ilike.%${q}%,description.ilike.%${q}%,category_slug.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error(`Error searching products for "${query}":`, error.message);
      return [];
    }

    return (data || []).map((row) => mapSupabaseToProduct(row as unknown as SupabaseProductRow));
  } catch (err) {
    console.error(`Failed to search products for "${query}":`, err);
    return [];
  }
}

/**
 * Fetches category details from Supabase or falls back to static metadata
 */
export async function fetchStorefrontCategory(slug: string): Promise<Category | null> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return mapSupabaseToCategory(data as unknown as SupabaseCategoryRow);
    }
  } catch {
    // ignore
  }

  return getCategoryBySlug(slug) || null;
}

/**
 * Fetches collection details from Supabase or falls back to static metadata
 */
export async function fetchStorefrontCollection(slug: string): Promise<Collection | null> {
  try {
    const supabase = getStorefrontClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return mapSupabaseToCollection(data as unknown as SupabaseCollectionRow);
    }
  } catch {
    // ignore
  }

  return getCollectionBySlug(slug) || null;
}
