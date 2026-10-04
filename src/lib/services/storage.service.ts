import { supabase } from '@/lib/supabase/client';

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates file MIME type and raw size
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload JPEG, PNG, WebP, or AVIF.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image file is too large. Maximum allowed size is 10 MB.',
    };
  }

  return { valid: true };
}

/**
 * Converts any browser-supported image file to optimized WebP format
 */
export async function convertToWebP(
  file: File,
  quality = 0.88,
  maxDimension = 2400
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If already WebP and within reasonable dimension, return blob directly
    if (file.type === 'image/webp' && file.size < 2 * 1024 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if exceeding max dimension while maintaining aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original file if canvas 2D context fails
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file); // Fallback to original
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for WebP conversion.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Extracts storage relative path from a full Supabase public URL
 */
export function extractStoragePath(bucket: string, publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    // Format: .../storage/v1/object/public/{bucket}/{path}
    const bucketMarker = `/storage/v1/object/public/${bucket}/`;
    const index = url.pathname.indexOf(bucketMarker);
    if (index !== -1) {
      return decodeURIComponent(url.pathname.substring(index + bucketMarker.length));
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Uploads a category image to 'category-media' bucket with a collision-safe UUID path
 */
export async function uploadCategoryImage(slug: string, file: File): Promise<{ url: string; path: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const webpBlob = await convertToWebP(file);
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const filePath = `categories/${cleanSlug}/${uuid}.webp`;

  const { error } = await supabase.storage
    .from('category-media')
    .upload(filePath, webpBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('category-media')
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
  };
}

/**
 * Uploads a collection image to 'collection-media' bucket with a collision-safe UUID path
 */
export async function uploadCollectionImage(slug: string, file: File): Promise<{ url: string; path: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const webpBlob = await convertToWebP(file);
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const filePath = `collections/${cleanSlug}/${uuid}.webp`;

  const { error } = await supabase.storage
    .from('collection-media')
    .upload(filePath, webpBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('collection-media')
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
  };
}

/**
 * Uploads a product image with role tag to 'product-media' bucket with collision-safe UUID path
 */
export async function uploadProductImage(
  slug: string,
  file: File,
  role: 'primary' | 'hover' | 'gallery' = 'primary'
): Promise<{ url: string; path: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const webpBlob = await convertToWebP(file);
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const filePath = `products/${cleanSlug}/${role}-${uuid}.webp`;

  const { error } = await supabase.storage
    .from('product-media')
    .upload(filePath, webpBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });

  if (error) {
    throw new Error(`Product storage upload failed (${role}): ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-media')
    .getPublicUrl(filePath);

  return {
    url: publicUrlData.publicUrl,
    path: filePath,
  };
}

/**
 * Concurrently uploads multiple gallery images for a product
 */
export async function uploadProductGalleryImages(
  slug: string,
  files: File[]
): Promise<{ urls: string[]; paths: string[] }> {
  const uploadPromises = files.map((file) => uploadProductImage(slug, file, 'gallery'));
  const results = await Promise.all(uploadPromises);
  return {
    urls: results.map((r) => r.url),
    paths: results.map((r) => r.path),
  };
}

/**
 * Safely deletes one or more files from Supabase storage using public URLs or paths
 */
export async function deleteStorageMedia(
  bucket: 'category-media' | 'collection-media' | 'product-media',
  urlOrPaths: string | string[]
): Promise<void> {
  if (!urlOrPaths) return;

  const items = Array.isArray(urlOrPaths) ? urlOrPaths : [urlOrPaths];
  const pathsToDelete: string[] = [];

  for (const item of items) {
    if (!item) continue;
    const path = item.startsWith('http')
      ? extractStoragePath(bucket, item)
      : item;
    if (path) {
      pathsToDelete.push(path);
    }
  }

  if (pathsToDelete.length === 0) return;

  try {
    await supabase.storage.from(bucket).remove(pathsToDelete);
  } catch (err) {
    // Non-fatal warning if image is already gone
    console.warn(`Failed to delete storage asset(s) from ${bucket}:`, pathsToDelete, err);
  }
}
