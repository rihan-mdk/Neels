import { supabase } from '@/lib/supabase/client';
import { CategoryFormData, CategoryRecord } from '@/lib/validations/category.schema';
import { CollectionFormData, CollectionRecord } from '@/lib/validations/collection.schema';
import {
  uploadCategoryImage,
  uploadCollectionImage,
  deleteStorageMedia,
} from './storage.service';

// ============================================================
// CATEGORY SERVICE (Admin CRUD)
// ============================================================

export async function fetchAdminCategories(): Promise<CategoryRecord[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return (data || []) as CategoryRecord[];
}

export async function fetchAdminCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch category ${slug}: ${error.message}`);
  }

  return data as CategoryRecord;
}

export async function createAdminCategory(
  formData: CategoryFormData,
  imageFile?: File
): Promise<CategoryRecord> {
  let uploadedImageUrl: string | null = null;
  let finalImageUrl = formData.image;

  if (imageFile) {
    const uploadRes = await uploadCategoryImage(formData.slug, imageFile);
    uploadedImageUrl = uploadRes.url;
    finalImageUrl = uploadRes.url;
  }

  const payload = {
    slug: formData.slug.trim(),
    name: formData.name.trim(),
    plural_name: formData.plural_name.trim(),
    path: formData.path.trim(),
    description: formData.description.trim(),
    editorial_description: formData.editorial_description.trim(),
    display_order: formData.display_order,
    image: finalImageUrl,
  };

  const { data, error } = await supabase
    .from('categories')
    .insert([payload])
    .select()
    .single();

  if (error) {
    // Compensating sequence: delete newly uploaded image if database insert failed
    if (uploadedImageUrl) {
      await deleteStorageMedia('category-media', uploadedImageUrl);
    }
    throw new Error(`Failed to create category: ${error.message}`);
  }

  return data as CategoryRecord;
}

export async function updateAdminCategory(
  currentSlug: string,
  formData: CategoryFormData,
  newImageFile?: File,
  oldImageUrl?: string
): Promise<CategoryRecord> {
  let newlyUploadedUrl: string | null = null;
  let finalImageUrl = formData.image;

  // 1. Upload new image if provided
  if (newImageFile) {
    const uploadRes = await uploadCategoryImage(formData.slug, newImageFile);
    newlyUploadedUrl = uploadRes.url;
    finalImageUrl = uploadRes.url;
  }

  const payload = {
    slug: formData.slug.trim(),
    name: formData.name.trim(),
    plural_name: formData.plural_name.trim(),
    path: formData.path.trim(),
    description: formData.description.trim(),
    editorial_description: formData.editorial_description.trim(),
    display_order: formData.display_order,
    image: finalImageUrl,
  };

  // 2. Update PostgreSQL database
  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('slug', currentSlug)
    .select()
    .single();

  if (error) {
    // Compensating sequence on failure: delete the new image
    if (newlyUploadedUrl) {
      await deleteStorageMedia('category-media', newlyUploadedUrl);
    }
    throw new Error(`Failed to update category: ${error.message}`);
  }

  // 3. Compensating sequence on success: delete old image if replaced
  if (newlyUploadedUrl && oldImageUrl && oldImageUrl !== newlyUploadedUrl) {
    await deleteStorageMedia('category-media', oldImageUrl);
  }

  return data as CategoryRecord;
}

export async function deleteAdminCategory(
  slug: string,
  imageUrl?: string
): Promise<void> {
  // 1. Attempt database row deletion
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('slug', slug);

  if (error) {
    // PostgreSQL Foreign Key RESTRICT rejection (23503)
    if (error.code === '23503' || error.message?.includes('violates foreign key constraint')) {
      throw new Error(
        `Cannot delete category "${slug}" because products are currently assigned to it. Please reassign or delete the associated products first.`
      );
    }
    throw new Error(`Failed to delete category: ${error.message}`);
  }

  // 2. If deletion succeeded, delete storage image
  if (imageUrl) {
    await deleteStorageMedia('category-media', imageUrl);
  }
}

export async function reorderAdminCategories(
  orderedSlugs: string[]
): Promise<void> {
  const updates = orderedSlugs.map((slug, index) =>
    supabase
      .from('categories')
      .update({ display_order: index })
      .eq('slug', slug)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed && failed.error) {
    throw new Error(`Failed to update display order: ${failed.error.message}`);
  }
}

// ============================================================
// COLLECTION SERVICE (Admin CRUD)
// ============================================================

export async function fetchAdminCollections(): Promise<CollectionRecord[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch collections: ${error.message}`);
  }

  return (data || []) as CollectionRecord[];
}

export async function fetchAdminCollectionBySlug(slug: string): Promise<CollectionRecord | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to fetch collection ${slug}: ${error.message}`);
  }

  return data as CollectionRecord;
}

export async function createAdminCollection(
  formData: CollectionFormData,
  imageFile?: File
): Promise<CollectionRecord> {
  let uploadedImageUrl: string | null = null;
  let finalImageUrl = formData.image;

  if (imageFile) {
    const uploadRes = await uploadCollectionImage(formData.slug, imageFile);
    uploadedImageUrl = uploadRes.url;
    finalImageUrl = uploadRes.url;
  }

  const payload = {
    slug: formData.slug.trim(),
    name: formData.name.trim(),
    short_name: formData.short_name.trim(),
    season: formData.season?.trim() || null,
    description: formData.description.trim(),
    long_description: formData.long_description.trim(),
    display_order: formData.display_order,
    image: finalImageUrl,
  };

  const { data, error } = await supabase
    .from('collections')
    .insert([payload])
    .select()
    .single();

  if (error) {
    if (uploadedImageUrl) {
      await deleteStorageMedia('collection-media', uploadedImageUrl);
    }
    throw new Error(`Failed to create collection: ${error.message}`);
  }

  return data as CollectionRecord;
}

export async function updateAdminCollection(
  currentSlug: string,
  formData: CollectionFormData,
  newImageFile?: File,
  oldImageUrl?: string
): Promise<CollectionRecord> {
  let newlyUploadedUrl: string | null = null;
  let finalImageUrl = formData.image;

  // 1. Upload new image if provided
  if (newImageFile) {
    const uploadRes = await uploadCollectionImage(formData.slug, newImageFile);
    newlyUploadedUrl = uploadRes.url;
    finalImageUrl = uploadRes.url;
  }

  const payload = {
    slug: formData.slug.trim(),
    name: formData.name.trim(),
    short_name: formData.short_name.trim(),
    season: formData.season?.trim() || null,
    description: formData.description.trim(),
    long_description: formData.long_description.trim(),
    display_order: formData.display_order,
    image: finalImageUrl,
  };

  // 2. Update PostgreSQL database
  const { data, error } = await supabase
    .from('collections')
    .update(payload)
    .eq('slug', currentSlug)
    .select()
    .single();

  if (error) {
    if (newlyUploadedUrl) {
      await deleteStorageMedia('collection-media', newlyUploadedUrl);
    }
    throw new Error(`Failed to update collection: ${error.message}`);
  }

  // 3. Delete old image if replaced
  if (newlyUploadedUrl && oldImageUrl && oldImageUrl !== newlyUploadedUrl) {
    await deleteStorageMedia('collection-media', oldImageUrl);
  }

  return data as CollectionRecord;
}

export async function deleteAdminCollection(
  slug: string,
  imageUrl?: string
): Promise<void> {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('slug', slug);

  if (error) {
    throw new Error(`Failed to delete collection: ${error.message}`);
  }

  // Products referencing this collection will automatically have collection_slug set to NULL
  if (imageUrl) {
    await deleteStorageMedia('collection-media', imageUrl);
  }
}

export async function reorderAdminCollections(
  orderedSlugs: string[]
): Promise<void> {
  const updates = orderedSlugs.map((slug, index) =>
    supabase
      .from('collections')
      .update({ display_order: index })
      .eq('slug', slug)
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed && failed.error) {
    throw new Error(`Failed to update display order: ${failed.error.message}`);
  }
}
