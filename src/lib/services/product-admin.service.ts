import { supabase } from '@/lib/supabase/client';
import {
  ProductFormData,
  ProductRecord,
  ProductQueryOptions,
  PaginatedProductsResult,
} from '@/lib/validations/product.schema';
import {
  uploadProductImage,
  uploadProductGalleryImages,
  deleteStorageMedia,
} from './storage.service';

// ============================================================
// PRODUCT ADMIN SERVICE (Comprehensive CRUD & Media Management)
// ============================================================

/**
 * Fetches paginated products with server-side filtering and exact total count
 */
export async function fetchAdminProducts(
  options: ProductQueryOptions = {}
): Promise<PaginatedProductsResult> {
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });

  // 1. Search filter across name, slug, fabric
  if (options.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.trim();
    query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%,fabric.ilike.%${q}%`);
  }

  // 2. Category filter
  if (options.categorySlug && options.categorySlug !== 'all') {
    query = query.eq('category_slug', options.categorySlug);
  }

  // 3. Collection filter
  if (options.collectionSlug && options.collectionSlug !== 'all') {
    if (options.collectionSlug === 'none') {
      query = query.is('collection_slug', null);
    } else {
      query = query.eq('collection_slug', options.collectionSlug);
    }
  }

  // 4. Status filter
  if (options.status === 'active') {
    query = query.eq('is_active', true);
  } else if (options.status === 'draft') {
    query = query.eq('is_active', false);
  }

  // 5. Featured / New filter
  if (options.featuredOnly) {
    query = query.eq('is_featured', true);
  }
  if (options.newOnly) {
    query = query.eq('is_new', true);
  }

  // 6. Ordering & Range (Default: created_at DESC)
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    products: (data || []) as ProductRecord[],
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Fetches a single product by ID
 */
export async function fetchAdminProductById(id: string): Promise<ProductRecord | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  return data as ProductRecord;
}

/**
 * Creates a new product with safe compensating storage upload
 */
export async function createAdminProduct(
  formData: ProductFormData,
  files?: {
    primary?: File;
    hover?: File;
    gallery?: File[];
  }
): Promise<ProductRecord> {
  const newlyUploadedUrls: string[] = [];
  let primaryImageUrl = formData.image_primary;
  let hoverImageUrl = formData.image_hover || null;
  let galleryImageUrls = [...formData.image_gallery];

  try {
    // 1. Upload Primary Image if file provided
    if (files?.primary) {
      const res = await uploadProductImage(formData.slug, files.primary, 'primary');
      primaryImageUrl = res.url;
      newlyUploadedUrls.push(res.url);
    }

    // 2. Upload Hover Image if file provided
    if (files?.hover) {
      const res = await uploadProductImage(formData.slug, files.hover, 'hover');
      hoverImageUrl = res.url;
      newlyUploadedUrls.push(res.url);
    }

    // 3. Upload Gallery Images if files provided
    if (files?.gallery && files.gallery.length > 0) {
      const res = await uploadProductGalleryImages(formData.slug, files.gallery);
      galleryImageUrls = [...galleryImageUrls, ...res.urls];
      newlyUploadedUrls.push(...res.urls);
    }

    // 4. Insert into database — generate collision-safe id client-side
    //    (id TEXT PRIMARY KEY has no database default on public.products)
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const payload = {
      id: newId,
      slug: formData.slug.trim(),
      name: formData.name.trim(),
      brand: formData.brand?.trim() || 'Neels',
      category_slug: formData.category_slug,
      collection_slug: formData.collection_slug || null,
      price: formData.price ?? null,
      price_formatted: formData.price_formatted.trim(),
      image_primary: primaryImageUrl,
      image_hover: hoverImageUrl,
      image_gallery: galleryImageUrls,
      sizes: formData.sizes,
      description: formData.description.trim(),
      details: formData.details.filter((d) => d.trim().length > 0),
      fabric: formData.fabric.trim(),
      care: formData.care.trim(),
      is_new: formData.is_new,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as ProductRecord;
  } catch (err) {
    // Compensating sequence: cleanup newly uploaded storage files on database failure
    if (newlyUploadedUrls.length > 0) {
      await deleteStorageMedia('product-media', newlyUploadedUrls);
    }
    throw new Error(err instanceof Error ? err.message : 'Failed to create product.');
  }
}

/**
 * Updates an existing product with role-aware media replacement
 */
export async function updateAdminProduct(
  id: string,
  formData: ProductFormData,
  files?: {
    primary?: File;
    hover?: File;
    galleryNew?: File[];
  },
  removedImageUrls: string[] = []
): Promise<ProductRecord> {
  const newlyUploadedUrls: string[] = [];
  let primaryImageUrl = formData.image_primary;
  let hoverImageUrl = formData.image_hover || null;
  let galleryImageUrls = [...formData.image_gallery];

  try {
    // 1. Upload new primary if provided
    if (files?.primary) {
      const res = await uploadProductImage(formData.slug, files.primary, 'primary');
      primaryImageUrl = res.url;
      newlyUploadedUrls.push(res.url);
    }

    // 2. Upload new hover if provided
    if (files?.hover) {
      const res = await uploadProductImage(formData.slug, files.hover, 'hover');
      hoverImageUrl = res.url;
      newlyUploadedUrls.push(res.url);
    }

    // 3. Upload new gallery additions if provided
    if (files?.galleryNew && files.galleryNew.length > 0) {
      const res = await uploadProductGalleryImages(formData.slug, files.galleryNew);
      galleryImageUrls = [...galleryImageUrls, ...res.urls];
      newlyUploadedUrls.push(...res.urls);
    }

    // 4. Update database record
    const payload = {
      slug: formData.slug.trim(),
      name: formData.name.trim(),
      brand: formData.brand?.trim() || 'Neels',
      category_slug: formData.category_slug,
      collection_slug: formData.collection_slug || null,
      price: formData.price ?? null,
      price_formatted: formData.price_formatted.trim(),
      image_primary: primaryImageUrl,
      image_hover: hoverImageUrl,
      image_gallery: galleryImageUrls,
      sizes: formData.sizes,
      description: formData.description.trim(),
      details: formData.details.filter((d) => d.trim().length > 0),
      fabric: formData.fabric.trim(),
      care: formData.care.trim(),
      is_new: formData.is_new,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 5. Compensating sequence on DB success: delete removed/replaced images
    if (removedImageUrls.length > 0) {
      await deleteStorageMedia('product-media', removedImageUrls);
    }

    return data as ProductRecord;
  } catch (err) {
    // Compensating sequence on DB failure: delete newly uploaded images
    if (newlyUploadedUrls.length > 0) {
      await deleteStorageMedia('product-media', newlyUploadedUrls);
    }
    throw new Error(err instanceof Error ? err.message : 'Failed to update product.');
  }
}

/**
 * Deletes a product: deletes DB row first, then cleans storage
 */
export async function deleteAdminProduct(
  id: string,
  allImageUrls: string[]
): Promise<{ success: boolean; warning?: string }> {
  // 1. Delete database row first
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete product from database: ${error.message}`);
  }

  // 2. DB deletion succeeded -> attempt storage media cleanup
  if (allImageUrls && allImageUrls.length > 0) {
    try {
      await deleteStorageMedia('product-media', allImageUrls);
    } catch (storageErr) {
      console.warn('Product database row deleted, but storage cleanup had errors:', storageErr);
      return {
        success: true,
        warning: 'Product deleted from database, but some storage files could not be removed.',
      };
    }
  }

  return { success: true };
}

/**
 * Quick toggle for Active status (Live / Draft)
 */
export async function toggleProductActiveStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update product status: ${error.message}`);
  }
}

/**
 * Quick toggle for Featured showcase status
 */
export async function toggleProductFeaturedStatus(
  id: string,
  isFeatured: boolean
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_featured: isFeatured })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update featured status: ${error.message}`);
  }
}

/**
 * Clones a product with unique slug, reuses existing image URLs, and saves as Draft
 */
export async function cloneAdminProduct(sourceId: string): Promise<ProductRecord> {
  const source = await fetchAdminProductById(sourceId);
  if (!source) {
    throw new Error('Source product not found.');
  }

  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const newSlug = `${source.slug}-copy-${randomSuffix}`;

  const payload = {
    slug: newSlug,
    name: `${source.name} (Copy)`,
    brand: source.brand,
    category_slug: source.category_slug,
    collection_slug: source.collection_slug,
    price: source.price,
    price_formatted: source.price_formatted,
    image_primary: source.image_primary,
    image_hover: source.image_hover,
    image_gallery: [...source.image_gallery],
    sizes: [...source.sizes],
    description: source.description,
    details: [...source.details],
    fabric: source.fabric,
    care: source.care,
    is_new: false,
    is_featured: false,
    is_active: false, // Save clone as Draft initially
  };

  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to clone product: ${error.message}`);
  }

  return data as ProductRecord;
}
