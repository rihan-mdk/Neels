import { z } from 'zod';

export const CollectionFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must not exceed 120 characters'),
  short_name: z
    .string()
    .min(2, 'Short name must be at least 2 characters')
    .max(80, 'Short name must not exceed 80 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  season: z
    .string()
    .max(60, 'Season must not exceed 60 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  long_description: z
    .string()
    .min(20, 'Long description must be at least 20 characters')
    .max(2500, 'Long description must not exceed 2500 characters'),
  display_order: z.number().int().min(0, 'Display order must be a non-negative integer'),
  image: z.string().min(1, 'A collection cover image is required'),
});

export type CollectionFormData = z.infer<typeof CollectionFormSchema>;

export interface CollectionRecord {
  slug: string;
  name: string;
  short_name: string;
  season?: string | null;
  description: string;
  long_description: string;
  image: string;
  display_order: number;
  created_at?: string;
}
