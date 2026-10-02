// ============================================================
// NEELSH — Categories Data
// ============================================================

import { IMAGES } from './images';
import { ProductCategory } from './products';

export interface Category {
  id: string;
  slug: string;
  name: string;
  pluralName: string;
  path: string;
  description: string;
  editorialDescription: string;
  image: string;
  category: ProductCategory;
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    slug: 'lehengas',
    name: 'Lehenga',
    pluralName: 'Lehengas',
    path: '/lehengas',
    description: 'Contemporary silhouettes enriched with intricate craftsmanship, created for celebrations that deserve something extraordinary.',
    editorialDescription:
      'The lehenga is the most celebrated of Indian silhouettes — expansive, dramatic, and deeply personal. At Neels Designer Studio, each lehenga begins not with fabric but with conversation: an exploration of the wearer, the occasion, and the story she wishes to tell.',
    image: IMAGES.categories.lehengas,
    category: 'lehengas',
  },
  {
    id: 'cat-002',
    slug: 'sarees',
    name: 'Saree',
    pluralName: 'Sarees',
    path: '/sarees',
    description: 'Heritage weaves and contemporary drapes, each piece a conversation between tradition and the present moment.',
    editorialDescription:
      'The saree is India\'s most enduring garment — six yards that can be everything from regal to intimate, formal to poetic. Neels approaches the saree with deep respect for its heritage and an eye toward the contemporary woman who wears it today.',
    image: IMAGES.categories.sarees,
    category: 'sarees',
  },
  {
    id: 'cat-003',
    slug: 'collections',
    name: 'Collection',
    pluralName: 'Collections',
    path: '/collections',
    description: 'Refined Indian silhouettes and contemporary ready-to-wear for celebrations — from anarkalis to palazzo suits to draped ensembles.',
    editorialDescription:
      'Neels Designer Studio\'s collections bring the precision of tailoring together with the luxury of Indian textiles. Each piece is designed for the modern woman who inhabits both worlds — celebrating her heritage while living firmly in the present.',
    image: IMAGES.categories.suitsAndDresses,
    category: 'suits-dresses',
  },
  {
    id: 'cat-004',
    slug: 'jewellery',
    name: 'Accessory',
    pluralName: 'Accessories',
    path: '/jewellery',
    description: 'Heirloom jewellery, fine rings, and artisanal accessories — kundan, polki, and 22-karat gold crafted by master artisans.',
    editorialDescription:
      'Gold has always been the language of celebration in India. At Neels Designer Studio, our jewellery is conceived as an extension of our couture — pieces that carry weight, memory and meaning. Each creation is handcrafted by master goldsmiths whose families have practised their art across generations.',
    image: IMAGES.categories.accessories,
    category: 'jewellery',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  if (slug === 'collections' || slug === 'suits-dresses') {
    return CATEGORIES.find((c) => c.slug === 'collections' || c.slug === 'suits-dresses');
  }
  return CATEGORIES.find((c) => c.slug === slug);
}
