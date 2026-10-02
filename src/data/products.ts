// ============================================================
// NEELSH â€” Product Data
// ============================================================

import { IMAGES } from './images';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'CUSTOM SIZE';
export type ProductCategory = 'lehengas' | 'sarees' | 'suits-dresses' | 'jewellery';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  collection?: string;
  collectionSlug?: string;
  price: number | null; // null = Price on Request
  priceFormatted: string;
  images: {
    primary: string;
    hover?: string;
    gallery: string[];
  };
  sizes: ProductSize[];
  description: string;
  details: string[];
  fabric: string;
  care: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const PRODUCTS: Product[] = [
  // â”€â”€ LEHENGAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'leh-001',
    slug: 'heritage-ivory-embroidered-lehenga',
    name: 'Heritage Ivory Embroidered Lehenga',
    brand: 'Neels',
    category: 'lehengas',
    collection: 'The Heritage Edit',
    collectionSlug: 'the-heritage-edit',
    price: 195000,
    priceFormatted: 'â‚¹1,95,000',
    images: {
      primary: IMAGES.lehengas.heritageIvory.primary,
      hover: IMAGES.lehengas.heritageIvory.hover,
      gallery: IMAGES.lehengas.heritageIvory.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'A refined ivory lehenga featuring intricate zardozi embroidery across the hem and dupatta border. Inspired by the textile traditions of Lucknow, this piece embodies understated grandeur.',
    details: [
      'Hand-embroidered zardozi work on georgette base',
      'Fully lined inner skirt in raw silk',
      'Includes matching dupatta with embroidered border',
      'Unstitched blouse fabric included',
      'Crafting time: 8â€“10 weeks',
    ],
    fabric: 'Georgette with raw silk lining',
    care: 'Dry clean only. Store in a breathable cotton bag.',
    isFeatured: true,
  },
  {
    id: 'leh-002',
    slug: 'crimson-heirloom-lehenga',
    name: 'Crimson Heirloom Lehenga',
    brand: 'Neels',
    category: 'lehengas',
    collection: 'The Bridal Couture',
    collectionSlug: 'the-bridal-couture',
    price: null,
    priceFormatted: 'PRICE ON REQUEST',
    images: {
      primary: IMAGES.lehengas.crimsonHeirloom.primary,
      hover: IMAGES.lehengas.crimsonHeirloom.hover,
      gallery: IMAGES.lehengas.crimsonHeirloom.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'A statement bridal lehenga in deep crimson, crafted from handwoven Banarasi silk with all-over aari embroidery. A piece made to become an heirloom.',
    details: [
      'Handwoven Banarasi silk base',
      'All-over aari and resham embroidery',
      'Heavy dupatta with kiran border',
      'Unstitched blouse in matching fabric',
      'Crafting time: 12â€“16 weeks',
    ],
    fabric: 'Handwoven Banarasi silk',
    care: 'Dry clean only. Professional heritage garment care recommended.',
    isFeatured: true,
  },
  {
    id: 'leh-003',
    slug: 'antique-gold-marodi-lehenga',
    name: 'Antique Gold Marodi Lehenga',
    brand: 'Neels',
    category: 'lehengas',
    collection: 'The Artisan Series',
    collectionSlug: 'the-artisan-series',
    price: 275000,
    priceFormatted: 'â‚¹2,75,000',
    images: {
      primary: IMAGES.lehengas.antiqueGoldMarodi.primary,
      hover: IMAGES.lehengas.antiqueGoldMarodi.hover,
      gallery: IMAGES.lehengas.antiqueGoldMarodi.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'Crafted in antique gold tissue, this lehenga features densely worked marodi embroidery by master artisans from Jaipur. A celebration of Indian textile heritage.',
    details: [
      'Antique gold tissue fabric',
      'Dense marodi thread embroidery',
      'Pleated skirt with embellished hem',
      'Dupatta with four-sided embroidered border',
      'Crafting time: 10â€“14 weeks',
    ],
    fabric: 'Tissue with zari thread embroidery',
    care: 'Dry clean only. Avoid direct sunlight for storage.',
    isNew: true,
  },
  {
    id: 'leh-004',
    slug: 'garden-rose-lehenga',
    name: 'Garden Rose Lehenga',
    brand: 'Neels',
    category: 'lehengas',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 165000,
    priceFormatted: 'â‚¹1,65,000',
    images: {
      primary: IMAGES.lehengas.gardenRose.primary,
      hover: IMAGES.lehengas.gardenRose.hover,
      gallery: IMAGES.lehengas.gardenRose.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'A soft rosÃ© lehenga adorned with hand-painted floral motifs and delicate sequin work. Designed for the contemporary celebration with a deeply feminine sensibility.',
    details: [
      'Organza base with satin lining',
      'Hand-painted floral embroidery',
      'Sequin embellishment throughout',
      'Blouse fabric included',
      'Crafting time: 6â€“8 weeks',
    ],
    fabric: 'Organza with satin lining',
    care: 'Dry clean only.',
    isFeatured: true,
  },
  {
    id: 'leh-005',
    slug: 'midnight-velvet-lehenga',
    name: 'Midnight Velvet Lehenga',
    brand: 'Neels',
    category: 'lehengas',
    collection: 'The Bridal Couture',
    collectionSlug: 'the-bridal-couture',
    price: null,
    priceFormatted: 'PRICE ON REQUEST',
    images: {
      primary: IMAGES.lehengas.midnightVelvet.primary,
      hover: IMAGES.lehengas.midnightVelvet.hover,
      gallery: IMAGES.lehengas.midnightVelvet.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'Deep midnight velvet with moonlit silver zardozi embroidery. A piece that commands presence while carrying the quiet sophistication that defines Neels couture.',
    details: [
      'Italian velvet with silver zardozi embroidery',
      'Kali-style skirt with intricate hem',
      'Silver foil printed dupatta',
      'Crafting time: 14â€“18 weeks',
    ],
    fabric: 'Velvet with zardozi embroidery',
    care: 'Dry clean only. Store flat to maintain velvet texture.',
  },
  {
    id: 'leh-006',
    slug: 'burnt-sienna-tissue-lehenga',
    name: 'Burnt Sienna Tissue Lehenga',
    brand: 'Neels',
    category: 'lehengas',
    collection: 'The Heritage Edit',
    collectionSlug: 'the-heritage-edit',
    price: 225000,
    priceFormatted: 'â‚¹2,25,000',
    images: {
      primary: IMAGES.lehengas.burntSiennaTissue.primary,
      hover: IMAGES.lehengas.burntSiennaTissue.hover,
      gallery: IMAGES.lehengas.burntSiennaTissue.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'A warm burnt sienna tissue lehenga with tonal hand embroidery and a contemporary silhouette. Rooted in heritage, refined for today.',
    details: [
      'Raw tissue fabric in warm sienna tones',
      'Tonal hand embroidery throughout',
      'Flared silhouette with broad hem',
      'Tissue dupatta included',
      'Crafting time: 8â€“10 weeks',
    ],
    fabric: 'Raw tissue silk',
    care: 'Dry clean only.',
    isNew: true,
  },

  // â”€â”€ SAREES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'sar-001',
    slug: 'heritage-silk-saree',
    name: 'Heritage Silk Saree',
    brand: 'Neels',
    category: 'sarees',
    collection: 'The Heritage Edit',
    collectionSlug: 'the-heritage-edit',
    price: 85000,
    priceFormatted: 'â‚¹85,000',
    images: {
      primary: IMAGES.sarees.heritageSilk.primary,
      hover: IMAGES.sarees.heritageSilk.hover,
      gallery: IMAGES.sarees.heritageSilk.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'A pure Kanjivaram silk saree with a broad zari border and traditional pallav. Woven by master weavers of Tamil Nadu, this is a piece to be worn and cherished across generations.',
    details: [
      'Pure Kanjivaram silk',
      'Broad zari woven border',
      'Traditional pallav with temple motifs',
      'Unstitched blouse piece included',
      '6.3 metres',
    ],
    fabric: 'Pure Kanjivaram silk',
    care: 'Dry clean only. Store with neem leaves.',
    isFeatured: true,
  },
  {
    id: 'sar-002',
    slug: 'mandala-tissue-saree',
    name: 'Mandala Tissue Saree',
    brand: 'Neels',
    category: 'sarees',
    collection: 'The Artisan Series',
    collectionSlug: 'the-artisan-series',
    price: 125000,
    priceFormatted: 'â‚¹1,25,000',
    images: {
      primary: IMAGES.sarees.mandalaTissue.primary,
      hover: IMAGES.sarees.mandalaTissue.hover,
      gallery: IMAGES.sarees.mandalaTissue.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'Tissue saree with an all-over hand-embroidered mandala pattern in fine gold thread. An elegant statement for the contemporary woman who values artisanal craftsmanship.',
    details: [
      'Pure tissue with gold thread embroidery',
      'All-over mandala motif pattern',
      'Pre-pleated for ease of wear available on request',
      'Fall and pico included',
    ],
    fabric: 'Pure tissue silk with zari thread',
    care: 'Dry clean only.',
    isNew: true,
  },
  {
    id: 'sar-003',
    slug: 'chocolate-brown-draped-saree',
    name: 'Chocolate Brown Draped Saree',
    brand: 'Neels',
    category: 'sarees',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 95000,
    priceFormatted: 'â‚¹95,000',
    images: {
      primary: IMAGES.sarees.chocolateDraped.primary,
      hover: IMAGES.sarees.chocolateDraped.hover,
      gallery: IMAGES.sarees.chocolateDraped.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'A contemporary draped saree in rich chocolate brown, designed for effortless elegance. The structured pre-drape silhouette offers a modern interpretation of the classic.',
    details: [
      'Structured pre-draped silhouette',
      'Pure crepe base',
      'Signature Neels pleating',
      'Contemporary blouse design included',
    ],
    fabric: 'Pure silk crepe',
    care: 'Dry clean only.',
    isFeatured: true,
  },
  {
    id: 'sar-004',
    slug: 'antique-gold-saree',
    name: 'Antique Gold Saree',
    brand: 'Neels',
    category: 'sarees',
    collection: 'The Heritage Edit',
    collectionSlug: 'the-heritage-edit',
    price: null,
    priceFormatted: 'PRICE ON REQUEST',
    images: {
      primary: IMAGES.sarees.antiqueGoldSaree.primary,
      hover: IMAGES.sarees.antiqueGoldSaree.hover,
      gallery: IMAGES.sarees.antiqueGoldSaree.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'An heirloom-quality antique gold saree with intricate kadwa weave. Each piece takes over 40 days to produce on a traditional loom.',
    details: [
      'Kadwa woven antique gold silk',
      'All-over butis with broad border',
      'Heritage loom-woven pallav',
      'Certificate of authenticity included',
    ],
    fabric: 'Handwoven antique gold silk',
    care: 'Dry clean only. Museum-quality preservation recommended.',
  },
  {
    id: 'sar-005',
    slug: 'crimson-handwoven-saree',
    name: 'Crimson Handwoven Saree',
    brand: 'Neels',
    category: 'sarees',
    collection: 'The Bridal Couture',
    collectionSlug: 'the-bridal-couture',
    price: 145000,
    priceFormatted: 'â‚¹1,45,000',
    images: {
      primary: IMAGES.sarees.crimsonHandwoven.primary,
      hover: IMAGES.sarees.crimsonHandwoven.hover,
      gallery: IMAGES.sarees.crimsonHandwoven.gallery,
    },
    sizes: ['S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'A handwoven crimson silk saree with intricate gold border, celebrating the timeless union of colour, craft and celebration.',
    details: [
      'Pure handwoven crimson silk',
      'Gold zari border and pallav',
      'Traditional motif weaving throughout',
      'Silk blouse fabric included',
    ],
    fabric: 'Handwoven pure silk',
    care: 'Dry clean only.',
    isNew: true,
  },

  // ── SUITS & DRESSES ──────────────────────────────────────────
  {
    id: 'sui-new-001',
    slug: 'ivory-fuchsia-embroidered-suit',
    name: 'Ivory & Fuchsia Embroidered Kurti Ensemble',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 48000,
    priceFormatted: '₹48,000',
    images: {
      primary: '/hero-gallery-1.jpeg',
      hover: '/hero-gallery-1.jpeg',
      gallery: ['/hero-gallery-1.jpeg'],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'Artisanal ivory georgette kurti set featuring vivid fuchsia floral embroidery, tassel placket detailing, paired with palazzo trousers and a sheer floral dupatta.',
    details: [
      'Pure georgette base with intricate floral thread embroidery',
      'Handcrafted front placket with traditional hanging tassels',
      'Wide-leg matching embroidered palazzo pants',
      'Lightweight dupatta with delicate border accents',
    ],
    fabric: 'Georgette with crepe lining',
    care: 'Dry clean only.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'sui-new-002',
    slug: 'royal-crimson-zardozi-anarkali',
    name: 'Royal Crimson Embroidered Anarkali Suit',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Bridal Couture',
    collectionSlug: 'the-bridal-couture',
    price: 64000,
    priceFormatted: '₹64,000',
    images: {
      primary: '/hero-gallery-2.jpeg',
      hover: '/hero-gallery-2.jpeg',
      gallery: ['/hero-gallery-2.jpeg'],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'Rich deep crimson silk velvet anarkali suit embellished with elaborate gold zardozi and gota patti craftsmanship. Complete with ornate scalloped dupatta.',
    details: [
      'Rich silk velvet silhouette with intricate yoke embroidery',
      'Heavy gold zari border hemline with tassel drops',
      'Statement sheer dupatta with scalloped borders',
      'Includes tailored flared trousers',
    ],
    fabric: 'Silk velvet and organza',
    care: 'Dry clean only.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'sui-new-003',
    slug: 'shimmering-bronze-evening-gown',
    name: 'Shimmering Bronze Evening Silhouette',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 36000,
    priceFormatted: '₹36,000',
    images: {
      primary: '/hero-gallery-3.jpeg',
      hover: '/hero-gallery-3.jpeg',
      gallery: ['/hero-gallery-3.jpeg'],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Contemporary draped shimmer dress in metallic bronze, tailored with flattering crossover neckline, ruched waistline, and an asymmetric modern hem.',
    details: [
      'Textured metallic lurex fabric with stretch comfort',
      'Flattering wrap silhouette with ruched gathering',
      'Concealed back zip closure',
      'Ideal for festive cocktail evenings and gala receptions',
    ],
    fabric: 'Metallic shimmer lurex blend',
    care: 'Dry clean only.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'sui-new-004',
    slug: 'sage-green-pearl-embroidered-suit',
    name: 'Sage Green Pearl Embroidered Suit',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Artisan Series',
    collectionSlug: 'the-artisan-series',
    price: 52000,
    priceFormatted: '₹52,000',
    images: {
      primary: '/hero-gallery-4.jpeg',
      hover: '/hero-gallery-4.jpeg',
      gallery: ['/hero-gallery-4.jpeg'],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'Pastel sage green straight-cut suit adorned with fine pearl drops, threadwork florals, and a shimmering tissue-striped organza dupatta.',
    details: [
      'Pure chanderi silk base with delicate pearl embellishments',
      'Intricate floral vine embroidery along bodice and hem',
      'Organza dupatta with zari tissue stripes and pearl hangings',
      'Straight-leg pants with coordinating embroidered borders',
    ],
    fabric: 'Chanderi silk with organza dupatta',
    care: 'Dry clean only.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'sui-001',
    slug: 'signature-velvet-suit',
    name: 'Signature Velvet Suit',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 115000,
    priceFormatted: 'â‚¹1,15,000',
    images: {
      primary: IMAGES.suits.signatureVelvet.primary,
      hover: IMAGES.suits.signatureVelvet.hover,
      gallery: IMAGES.suits.signatureVelvet.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'The defining Neels three-piece suit in deep jewel-toned velvet. A refined silhouette for celebrations that call for quiet, confident elegance.',
    details: [
      'Kurta in velvet with tonal embroidery',
      'Wide-leg palazzo trousers',
      'Dupatta in matching crepe',
      'Fully lined throughout',
    ],
    fabric: 'Velvet with crepe dupatta',
    care: 'Dry clean only.',
    isFeatured: true,
  },
  {
    id: 'sui-002',
    slug: 'ivory-embroidered-suit',
    name: 'Ivory Embroidered Suit',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Heritage Edit',
    collectionSlug: 'the-heritage-edit',
    price: 95000,
    priceFormatted: 'â‚¹95,000',
    images: {
      primary: IMAGES.suits.ivoryEmbroidered.primary,
      hover: IMAGES.suits.ivoryEmbroidered.hover,
      gallery: IMAGES.suits.ivoryEmbroidered.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'An ivory three-piece suit with delicate chikankari embroidery. A timeless piece that bridges heritage craftsmanship and contemporary occasion dressing.',
    details: [
      'Georgette kurta with chikankari embroidery',
      'Straight-cut trousers',
      'Embroidered dupatta',
      'Blouse-style kurta with long silhouette',
    ],
    fabric: 'Georgette with chikankari',
    care: 'Dry clean only.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'sui-003',
    slug: 'garden-bloom-dress',
    name: 'Garden Bloom Dress',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 78000,
    priceFormatted: 'â‚¹78,000',
    images: {
      primary: IMAGES.suits.gardenBloom.primary,
      hover: IMAGES.suits.gardenBloom.hover,
      gallery: IMAGES.suits.gardenBloom.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'A contemporary floor-length dress in printed organza with hand-embroidered floral details. Where the botanical meets the refined.',
    details: [
      'Organza with digital floral print',
      'Hand-embroidered accents throughout',
      'A-line silhouette',
      'Fully lined inner slip',
    ],
    fabric: 'Silk organza with inner silk lining',
    care: 'Dry clean only.',
  },
  {
    id: 'sui-004',
    slug: 'rose-silk-anarkali',
    name: 'Rose Silk Anarkali',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Artisan Series',
    collectionSlug: 'the-artisan-series',
    price: 135000,
    priceFormatted: 'â‚¹1,35,000',
    images: {
      primary: IMAGES.suits.roseSilkAnarkali.primary,
      hover: IMAGES.suits.roseSilkAnarkali.hover,
      gallery: IMAGES.suits.roseSilkAnarkali.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'CUSTOM SIZE'],
    description:
      'A sweeping rose silk anarkali with dense hand embroidery across the bodice and hem. A celebration of the classic Indian silhouette elevated through artisan craftsmanship.',
    details: [
      'Pure silk anarkali with embroidered yoke',
      'Embellished hem and sleeve edges',
      'Matching churidar included',
      'Silk dupatta with embroidered border',
    ],
    fabric: 'Pure silk with zari embroidery',
    care: 'Dry clean only.',
    isFeatured: true,
  },
  {
    id: 'sui-005',
    slug: 'contemporary-draped-ensemble',
    name: 'Contemporary Draped Ensemble',
    brand: 'Neels',
    category: 'suits-dresses',
    collection: 'The Signature Edit',
    collectionSlug: 'the-signature-edit',
    price: 88000,
    priceFormatted: 'â‚¹88,000',
    images: {
      primary: IMAGES.suits.contemporaryDraped.primary,
      hover: IMAGES.suits.contemporaryDraped.hover,
      gallery: IMAGES.suits.contemporaryDraped.gallery,
    },
    sizes: ['XS', 'S', 'M', 'L', 'CUSTOM SIZE'],
    description:
      'A contemporary draped ensemble that reimagines traditional Indian layering through a modern silhouette. Designed for the woman who moves between worlds with ease.',
    details: [
      'Draped kurta in silk crepe',
      'Structured flared trousers',
      'Asymmetric drape detail at front',
      'Contrast stitch detailing',
    ],
    fabric: 'Silk crepe',
    care: 'Dry clean only.',
    isNew: true,
  },
  // â”€â”€ JEWELLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'jwl-001',
    slug: 'antique-gold-statement-necklace',
    name: 'Antique Gold Statement Necklace',
    brand: 'Neels',
    category: 'jewellery',
    collection: 'The Heritage Edit',
    collectionSlug: 'the-heritage-edit',
    price: 85000,
    priceFormatted: 'â‚¹85,000',
    images: {
      primary: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85',
      hover: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=90',
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=90',
      ],
    },
    sizes: ['CUSTOM SIZE'],
    description: 'An heirloom-quality statement necklace crafted in 22-karat antique gold with hand-set polki diamonds. Each piece is finished by our master goldsmiths using centuries-old techniques.',
    details: [
      '22-karat antique gold finish',
      'Hand-set polki diamonds',
      'Adjustable chain length',
      'Handcrafted in Jaipur',
      'Includes heritage jewellery box',
    ],
    fabric: '22-karat gold, polki diamonds',
    care: 'Store in the provided box away from moisture. Clean gently with a soft cloth.',
    isFeatured: true,
    isNew: true,
  },
  {
    id: 'jwl-002',
    slug: 'kundan-bridal-choker',
    name: 'Kundan Bridal Choker',
    brand: 'Neels',
    category: 'jewellery',
    collection: 'The Bridal Couture',
    collectionSlug: 'the-bridal-couture',
    price: 125000,
    priceFormatted: 'â‚¹1,25,000',
    images: {
      primary: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=85',
      hover: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=700&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=90',
        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=90',
      ],
    },
    sizes: ['CUSTOM SIZE'],
    description: 'A magnificent kundan choker set in 24-karat gold foil with uncut diamonds and natural gemstones. Designed for the modern bride who honours tradition.',
    details: [
      '24-karat gold foil base',
      'Uncut kundan diamonds',
      'Natural emeralds and rubies',
      'Includes matching earrings',
      'Handcrafted in Rajasthan',
    ],
    fabric: '24-karat gold foil, kundan, gemstones',
    care: 'Avoid contact with water and perfume. Store in the provided velvet pouch.',
    isFeatured: true,
  },
  {
    id: 'jwl-003',
    slug: 'rose-gold-diamond-cocktail-ring',
    name: 'Rose Gold Diamond Cocktail Ring',
    brand: 'Neels',
    category: 'jewellery',
    price: 210000,
    priceFormatted: 'â‚¹2,10,000',
    images: {
      primary: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85',
      hover: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=90',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90',
      ],
    },
    sizes: ['CUSTOM SIZE'],
    description: 'A sculptural cocktail ring in 18-karat rose gold set with a 2.5-carat oval diamond, surrounded by a pavÃ© halo. Understated grandeur for evenings that matter.',
    details: [
      '18-karat rose gold',
      '2.5-carat oval diamond centre',
      'PavÃ© diamond halo',
      'Custom sizing available',
      'GIA certified stone',
    ],
    fabric: '18-karat rose gold, GIA certified diamonds',
    care: 'Clean with a soft brush and mild soap. Avoid harsh chemicals.',
    isNew: true,
  },
  {
    id: 'jwl-004',
    slug: 'gold-temple-bangles-set',
    name: 'Gold Temple Bangles Set',
    brand: 'Neels',
    category: 'jewellery',
    collection: 'The Artisan Series',
    collectionSlug: 'the-artisan-series',
    price: 58000,
    priceFormatted: 'â‚¹58,000',
    images: {
      primary: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=700&q=85',
      hover: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=90',
      ],
    },
    sizes: ['CUSTOM SIZE'],
    description: 'A set of four temple-motif bangles in 22-karat gold, each engraved by hand with traditional South Indian motifs. Worn as a set or individually.',
    details: [
      'Set of four bangles',
      '22-karat gold',
      'Hand-engraved temple motifs',
      'Available in custom sizes',
      'Handcrafted in Chennai',
    ],
    fabric: '22-karat gold',
    care: 'Store separately to avoid scratching. Polish gently with a gold cloth.',
  },
  {
    id: 'jwl-005',
    slug: 'polki-chandelier-jhumkas',
    name: 'Polki Chandelier Jhumkas',
    brand: 'Neels',
    category: 'jewellery',
    price: 42000,
    priceFormatted: 'â‚¹42,000',
    images: {
      primary: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85',
      hover: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=90',
      ],
    },
    sizes: ['CUSTOM SIZE'],
    description: 'Statement chandelier jhumkas in oxidised gold set with polki diamonds and pearl drops. A timeless design that moves with you.',
    details: [
      'Oxidised gold finish',
      'Polki diamond detailing',
      'Natural pearl drops',
      'Secure push-back closure',
      'Length: 8 cm',
    ],
    fabric: 'Oxidised gold, polki, natural pearls',
    care: 'Avoid moisture and perfume. Store in the provided pouch.',
    isNew: true,
  },
];

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.collectionSlug === collectionSlug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  const newItems = PRODUCTS.filter((p) => p.isNew);
  if (newItems.length >= limit) return newItems.slice(0, limit);
  const remaining = PRODUCTS.filter((p) => !p.isNew);
  return [...newItems, ...remaining].slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.collection?.toLowerCase().includes(q) ?? false) ||
      p.description.toLowerCase().includes(q)
  );
}
