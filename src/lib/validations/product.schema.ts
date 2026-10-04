import { z } from 'zod';

export const STANDARD_PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'] as const;

export const ProductFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(150, 'Product name must not exceed 150 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(120, 'Slug must not exceed 120 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  brand: z.string().min(1, 'Brand is required'),
  category_slug: z.string().min(1, 'Category is required'),
  collection_slug: z.string().nullable().optional(),
  price: z.number().positive('Price must be greater than 0').nullable().optional(),
  price_formatted: z.string().min(1, 'Formatted price is required'),
  image_primary: z.string().min(1, 'Primary cover image is required'),
  image_hover: z.string().nullable().optional(),
  image_gallery: z.array(z.string()),
  sizes: z.array(z.string()).min(1, 'Select at least one available size'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  details: z.array(z.string()).min(1, 'Add at least one craftsmanship detail'),
  fabric: z.string().min(2, 'Fabric details are required'),
  care: z.string().min(2, 'Care instructions are required'),
  is_new: z.boolean(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_slug: string;
  collection_slug?: string | null;
  price: number | null;
  price_formatted: string;
  image_primary: string;
  image_hover?: string | null;
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
}

export interface ProductQueryOptions {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  categorySlug?: string;
  collectionSlug?: string;
  status?: 'all' | 'active' | 'draft';
  featuredOnly?: boolean;
  newOnly?: boolean;
}

export interface PaginatedProductsResult {
  products: ProductRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
