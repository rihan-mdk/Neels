// ============================================================
// NEELSH — Collections Data
// ============================================================

import { IMAGES } from './images';

export interface Collection {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  image: string;
  season?: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-001',
    slug: 'the-heritage-edit',
    name: 'The Heritage Edit',
    shortName: 'Heritage Edit',
    description: 'Timeless silhouettes inspired by India\'s architectural and textile heritage.',
    longDescription:
      'The Heritage Edit draws from the rich visual language of Indian craftsmanship — from the geometry of Mughal architecture to the delicate motifs of Lucknawi chikankari. Each piece in this collection is designed to feel both deeply rooted and entirely contemporary.',
    image: IMAGES.collections.heritageEdit,
    season: 'Perennial',
  },
  {
    id: 'col-002',
    slug: 'the-signature-edit',
    name: 'The Signature Edit',
    shortName: 'Signature Edit',
    description: 'The defining Neels silhouettes, refined for modern celebrations.',
    longDescription:
      'The Signature Edit represents the distilled essence of Neels Designer Studio — our most considered silhouettes, our most refined textiles, and our most enduring design language. These are the pieces that define the studio.',
    image: IMAGES.collections.signatureEdit,
    season: 'Perennial',
  },
  {
    id: 'col-003',
    slug: 'the-artisan-series',
    name: 'The Artisan Series',
    shortName: 'Artisan Series',
    description: 'Handcrafted pieces celebrating embroidery, texture and meticulous detail.',
    longDescription:
      'The Artisan Series is a celebration of the master craftspeople who bring Neels to life. Each piece in this collection is developed in direct collaboration with artisans whose families have practiced their craft for generations.',
    image: IMAGES.collections.artisanSeries,
    season: 'Limited Edition',
  },
  {
    id: 'col-004',
    slug: 'the-bridal-couture',
    name: 'The Bridal Couture',
    shortName: 'Bridal Couture',
    description: 'Statement couture created for the most unforgettable celebrations.',
    longDescription:
      'The Bridal Couture collection is developed for the moments that become memories. Each piece begins as a conversation — about the woman, the occasion, and the story she wishes to tell. The result is couture that is as individual as she is.',
    image: IMAGES.collections.bridalCouture,
    season: 'By Appointment',
  },
  {
    id: 'col-005',
    slug: 'the-nocturne-soiree',
    name: 'The Nocturne Soirée',
    shortName: 'Nocturne Soirée',
    description: 'Deep jewel tones, midnight velvets, and luminous metallic embroideries for nightfall celebrations.',
    longDescription:
      'The Nocturne Soirée explores the quiet drama of after-dark celebrations. Sculptural silhouettes meet midnight jewel tones, accented by hand-embroidered metallic threads that catch candlelight.',
    image: IMAGES.collections.nocturneSoiree,
    season: 'AW 2026',
  },
  {
    id: 'col-006',
    slug: 'the-royal-resham',
    name: 'The Royal Resham',
    shortName: 'Royal Resham',
    description: 'Pure mulberry silks woven with intricate resham threadwork and vintage zari borders.',
    longDescription:
      'An homage to royal court textiles, The Royal Resham brings together master weavers from Varanasi and Kashmir. Each garment features delicate resham flora motifs on handloom raw silks.',
    image: IMAGES.collections.royalResham,
    season: 'Limited Edition',
  },
  {
    id: 'col-007',
    slug: 'the-ivory-atelier',
    name: 'The Ivory Atelier',
    shortName: 'Ivory Atelier',
    description: 'Pristine tone-on-tone threadwork, pearls, and gossamer organza celebrating understated grandeur.',
    longDescription:
      'The Ivory Atelier is a study in monochrome luxury. Intricate tone-on-tone chikankari embroidery, delicate freshwater pearls, and luminous hand-spun organza create poetry in cream and ivory.',
    image: IMAGES.collections.ivoryAtelier,
    season: 'Couture',
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
