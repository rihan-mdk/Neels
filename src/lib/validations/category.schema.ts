import { z } from 'zod';

export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  plural_name: z
    .string()
    .min(2, 'Plural name must be at least 2 characters')
    .max(100, 'Plural name must not exceed 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  path: z
    .string()
    .min(1, 'Path is required')
    .regex(/^\/[a-z0-9\-_/]*$/, 'Path must start with / (e.g. /lehengas)'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  editorial_description: z
    .string()
    .min(20, 'Editorial description must be at least 20 characters')
    .max(2000, 'Editorial description must not exceed 2000 characters'),
  display_order: z.number().int().min(0, 'Display order must be a non-negative integer'),
  image: z.string().min(1, 'A category cover image is required'),
});

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;

export interface CategoryRecord {
  slug: string;
  name: string;
  plural_name: string;
  path: string;
  description: string;
  editorial_description: string;
  image: string;
  display_order: number;
  created_at?: string;
}
