'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ChevronLeft,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scissors,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  X,
  Check
} from 'lucide-react';
import { Product, ProductSize } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductGallery from '@/components/products/ProductGallery';
import SizeSelector from '@/components/products/SizeSelector';
import CustomSizeModal from '@/components/products/CustomSizeModal';
import StylistModal from '@/components/overlays/StylistModal';
import Accordion from '@/components/ui/Accordion';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/products/ProductGrid';
import styles from './ProductDetail.module.css';

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

const CATEGORY_MAP: Record<string, string> = {
  lehengas: 'Lehengas',
  sarees: 'Sarees',
  'suits-dresses': 'Suits & Dresses',
  jewellery: 'Jewellery',
};

// ── Fear-busting policies data ──
const TRUST_POLICIES = [
  {
    id: 'authenticity',
    title: '100% Certified Authentic',
    desc: 'Handcrafted in our signature atelier with pure silks and certified bullion zari.',
    badge: 'Artisanal Guarantee',
    icon: ShieldCheck,
  },
  {
    id: 'tailoring',
    title: 'Bespoke Fit Promise',
    desc: 'Free 1-on-1 virtual styling and measurements with complimentary alteration support.',
    badge: 'Custom Fitted',
    icon: Scissors,
  },
  {
    id: 'shipping',
    title: 'Insured Global Air Express',
    desc: 'Tracked, tamper-evident luxury keepsake packaging dispatched directly to your doorstep.',
    badge: 'Express Insured',
    icon: Truck,
  },
  {
    id: 'exchange',
    title: '7-Day Easy Exchange',
    desc: 'Complimentary exchanges on standard sizes; dedicated atelier support on bespoke.',
    badge: 'Hassle-Free',
    icon: RotateCcw,
  },
];

// ── Dropdown Q&A FAQs data ──
const PRODUCT_FAQS = [
  {
    id: 'faq-1',
    q: 'How does custom sizing and the virtual measurement session work?',
    a: 'After selecting "Custom Size" or completing your order, our master couture team contacts you within 24 hours via WhatsApp. We offer a step-by-step measurement guide and can arrange a complimentary 1-on-1 video consultation with a senior stylist to verify your proportions.',
  },
  {
    id: 'faq-2',
    q: 'Can I personalize the blouse cut, sleeve length, or dupatta styling?',
    a: 'Yes. Because each creation is hand-embellished and made in our atelier, subtle design adaptations—such as neckline modifications, sleeve linings, or custom dupatta borders—are gladly accommodated. You can request changes during consultation or via WhatsApp.',
  },
  {
    id: 'faq-3',
    q: 'What is the estimated crafting and dispatch timeline?',
    a: 'Standard ready sizes dispatch within 2–3 business days. Made-to-measure bespoke pieces take 2–3 weeks of meticulous embroidery, zari weaving, and quality inspection before shipping via express air courier with live tracking.',
  },
  {
    id: 'faq-4',
    q: 'What if the garment requires further alterations upon arrival?',
    a: 'Every bespoke ensemble is protected by our Perfect Fit Guarantee. If minor alterations are required, our atelier provides complimentary adjustment assistance or works with your local tailoring preference.',
  },
  {
    id: 'faq-5',
    q: 'How do I care for and store this heirloom bridal piece?',
    a: 'We strictly recommend specialized dry clean only. Store the garment inside the complimentary breathable muslin dust bag provided with your order. Avoid hanging heavy lehengas for extended periods and shield metallic embroidery from direct perfume spray.',
  },
];

// ── Social Proof & Client Reviews data ──
const PRODUCT_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Devika Singhania',
    location: 'Mumbai',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    title: 'Exquisite craftsmanship & breathtaking drape',
    comment: 'Wore this for my sangeet celebration and the handwork left everyone mesmerized. The zari gleams with a soft, regal luster without being overpowering. Neels’ styling concierge guided me through blouse fitting over WhatsApp, and the fit was flawless.',
    fit: 'True to Size',
  },
  {
    id: 'rev-2',
    author: 'Ananya Mehta',
    location: 'New Delhi',
    rating: 5,
    date: '1 month ago',
    verified: true,
    title: 'Pure couture luxury — worth every detail',
    comment: 'The weight of the raw silk, the precision of the hand zardozi, and the inner silk lining speak for themselves. It arrived in an exquisite bridal keepsake box with a garment protector. The concierge answered all questions regarding sleeve length effortlessly.',
    fit: 'Custom Fit Perfection',
  },
  {
    id: 'rev-3',
    author: 'Rhea Chawla',
    location: 'Bengaluru',
    rating: 5,
    date: '2 months ago',
    verified: true,
    title: 'Flawless virtual fitting experience',
    comment: 'I was hesitant ordering couture online, but their stylist scheduled a virtual measurement call that eliminated all doubts. When the delivery arrived, not even a millimeter was out of place. Thank you Neels team!',
    fit: 'True to Size',
  },
];

export default function ProductDetailClient({
  product,
  related,
}: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [customSizeOpen, setCustomSizeOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [mobileImgIdx, setMobileImgIdx] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  
  // Interactive state for Q&A dropdowns
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  
  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const { addToCart } = useCart();

  const gallery = product.images.gallery;
  const totalImages = gallery.length;

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size to continue.');
      return;
    }
    addToCart(product, selectedSize);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 5000);
  };

  const categoryLabel = CATEGORY_MAP[product.category] ?? product.category.charAt(0).toUpperCase() + product.category.slice(1);

  // Touch swipe for mobile gallery
  let touchStartX = 0;
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && mobileImgIdx < totalImages - 1) setMobileImgIdx(mobileImgIdx + 1);
    if (dx > 0 && mobileImgIdx > 0) setMobileImgIdx(mobileImgIdx - 1);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalOpen(false);
      setNewReviewName('');
      setNewReviewCity('');
      setNewReviewComment('');
    }, 2200);
  };

  const accordionItems = [
    {
      id: 'details',
      title: 'Product Details',
      content: (
        <ul>
          {product.details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      ),
    },
    {
      id: 'stylist',
      title: 'Contact Our Stylist',
      content: (
        <div className={styles.stylistContent}>
          <p>Our styling team is available for private consultations to help you make the perfect selection for your occasion.</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '16px' }}
            onClick={() => setStylistOpen(true)}
          >
            Request a Consultation
          </button>
        </div>
      ),
    },
    {
      id: 'fabric',
      title: 'Product Declaration',
      content: (
        <div>
          <p><strong>Fabric:</strong> {product.fabric}</p>
          <p style={{ marginTop: '8px' }}><strong>Care:</strong> {product.care}</p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: (
        <div>
          <p>All Neels pieces are carefully packaged and dispatched within 2–3 business days of your order, unless a crafting period is specified.</p>
          <p style={{ marginTop: '8px' }}>Bespoke and couture pieces are non-returnable. Ready pieces may be returned within 7 days in original condition.</p>
          <p style={{ marginTop: '8px' }}>For returns or queries, please contact our customer care team.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.page}>

        {/* ────────────────────────────────────────────────
            MOBILE LAYOUT — shown only ≤ 768px
        ──────────────────────────────────────────────── */}
        <div className={styles.mobileLayout}>

          {/* ── Top bar: back / title / wishlist ── */}
          <div className={styles.mTopBar}>
            <button className={styles.mBackBtn} onClick={() => window.history.back()} aria-label="Go back">
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <span className={styles.mTopTitle}>Product Details</span>
            <button className={styles.mWishBtn} aria-label="Add to wishlist">
              <Heart size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* ── Image gallery — half screen ── */}
          <div
            className={styles.mGallery}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            <div
              className={styles.mGalleryTrack}
              style={{ transform: `translateX(-${mobileImgIdx * 100}%)` }}
            >
              {gallery.map((src, i) => (
                <div key={i} className={styles.mGallerySlide}>
                  <Image
                    src={src}
                    alt={`${product.name} — view ${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className={styles.mGalleryImg}
                  />
                </div>
              ))}
            </div>

            {/* Image counter */}
            {totalImages > 1 && (
              <span className={styles.mImgCounter}>
                {mobileImgIdx + 1}/{totalImages}
              </span>
            )}

            {/* Dots */}
            {totalImages > 1 && (
              <div className={styles.mGalleryDots}>
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={i === mobileImgIdx ? styles.mDotActive : styles.mDot}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className={styles.mInfo}>

            {/* Category label */}
            <p className={styles.mCategory}>{categoryLabel}</p>

            {/* Product name */}
            <h1 className={styles.mName}>{product.name}</h1>

            {/* Price + Rating pill */}
            <div className={styles.mPriceRatingRow}>
              <p className={styles.mPrice}>{product.priceFormatted}</p>
              <div className={styles.mRatingPill}>
                <div className={styles.starsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#C5A059" color="#C5A059" />
                  ))}
                </div>
                <span className={styles.ratingText}>4.9 (42)</span>
              </div>
            </div>

            {/* ── Size + Color row ── */}
            <div className={styles.mSizeColorRow}>
              {/* Size selectors (left) */}
              <div className={styles.mSizeBlock}>
                <div className={styles.mBlockHeader}>
                  <span className={styles.mBlockLabel}>Size</span>
                  <button
                    type="button"
                    className={styles.mSizeGuideLink}
                    onClick={() => setCustomSizeOpen(true)}
                  >
                    Custom Size Guide
                  </button>
                </div>
                <div className={styles.mSizeOptions}>
                  {product.sizes.filter(s => s !== 'CUSTOM SIZE').map((size) => (
                    <button
                      key={size}
                      className={`${styles.mSizeBtn} ${selectedSize === size ? styles.mSizeBtnActive : ''}`}
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color dots (right) */}
              <div className={styles.mColorBlock}>
                <span className={styles.mBlockLabel}>Color</span>
                <div className={styles.mColorOptions}>
                  <span className={`${styles.mColorDot} ${styles.mColorDotActive}`} style={{ backgroundColor: '#181515' }} title="Noir Black" />
                  <span className={styles.mColorDot} style={{ backgroundColor: '#D9A7A7' }} title="Dusty Rose" />
                  <span className={styles.mColorDot} style={{ backgroundColor: '#DCCFC8' }} title="Ivory Champagne" />
                </div>
              </div>
            </div>

            {/* ── Description (expandable) ── */}
            <div className={styles.mDescBlock}>
              <button
                className={styles.mDescToggle}
                onClick={() => setDescExpanded(!descExpanded)}
                aria-expanded={descExpanded}
              >
                <span>Description & Atelier Craft</span>
                {descExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {descExpanded && (
                <div className={styles.mDescContent}>
                  <p className={styles.mDescText}>{product.description}</p>
                  <div className={styles.mFabricTag}>
                    <span>Fabric: {product.fabric}</span>
                    <span>Care: {product.care}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── CTA buttons — same line ── */}
            <div className={styles.mCtaRow}>
              <button
                type="button"
                className={styles.mAddToCart}
                onClick={handleAddToBag}
              >
                <ShoppingBag size={15} strokeWidth={1.5} />
                {addedToBag ? 'Added ✓' : 'Add to Cart'}
              </button>
              <Link
                href="/checkout"
                className={styles.mBuyNow}
                onClick={() => {
                  if (selectedSize) addToCart(product, selectedSize);
                }}
              >
                Buy Now
              </Link>
            </div>

            {/* Added-to-bag notice */}
            {addedToBag && (
              <div className={styles.addedNotice}>
                <span>✓ Item added to your shopping bag.</span>
                <Link href="/cart" className={styles.viewCartLink}>View Cart →</Link>
              </div>
            )}

            {/* ────────────────────────────────────────────────
                FEAR-BUSTING POLICIES (Mobile)
            ──────────────────────────────────────────────── */}
            <div className={styles.mTrustSection}>
              <div className={styles.trustGrid}>
                {TRUST_POLICIES.map((policy) => {
                  const Icon = policy.icon;
                  return (
                    <div key={policy.id} className={styles.trustCard}>
                      <div className={styles.trustIconWrap}>
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <div className={styles.trustText}>
                        <h4 className={styles.trustTitle}>{policy.title}</h4>
                        <p className={styles.trustDesc}>{policy.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Concierge Banner */}
              <div className={styles.mConciergeBanner}>
                <div className={styles.conciergeInfo}>
                  <MessageCircle size={16} />
                  <span>Need personal sizing or occasion advice?</span>
                </div>
                <button
                  type="button"
                  className={styles.conciergeBtn}
                  onClick={() => setStylistOpen(true)}
                >
                  Consult Stylist
                </button>
              </div>
            </div>

            {/* ────────────────────────────────────────────────
                DROPDOWN Q&A / FAQs (Mobile)
            ──────────────────────────────────────────────── */}
            <div className={styles.mFaqSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <HelpCircle size={16} className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Questions & Answers</h3>
                </div>
                <span className={styles.sectionSub}>Atelier Guide</span>
              </div>

              <div className={styles.faqList}>
                {PRODUCT_FAQS.map((item) => {
                  const isOpen = openFaq === item.id;
                  return (
                    <div key={item.id} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                      <button
                        type="button"
                        className={styles.faqQuestion}
                        onClick={() => setOpenFaq(isOpen ? null : item.id)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.q}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {isOpen && (
                        <div className={styles.faqAnswer}>
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ────────────────────────────────────────────────
                SOCIAL PROOFS & REVIEWS (Mobile)
            ──────────────────────────────────────────────── */}
            <div className={styles.mReviewsSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderLeft}>
                  <Star size={16} className={styles.sectionIcon} fill="#C5A059" color="#C5A059" />
                  <h3 className={styles.sectionTitle}>Client Reviews & Proof</h3>
                </div>
                <button
                  type="button"
                  className={styles.writeReviewBtn}
                  onClick={() => setReviewModalOpen(true)}
                >
                  Write Review
                </button>
              </div>

              {/* Score Snapshot */}
              <div className={styles.scoreSnapshot}>
                <div className={styles.scoreBig}>
                  <span className={styles.scoreNum}>4.9</span>
                  <div className={styles.scoreStars}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#C5A059" color="#C5A059" />
                    ))}
                  </div>
                  <span className={styles.scoreCount}>Based on 42 verified clients</span>
                </div>
                <div className={styles.scoreHighlights}>
                  <div className={styles.highlightPill}>
                    <CheckCircle2 size={12} color="#4A7C59" />
                    <span>100% Handcrafted</span>
                  </div>
                  <div className={styles.highlightPill}>
                    <CheckCircle2 size={12} color="#4A7C59" />
                    <span>98% True to Fit</span>
                  </div>
                </div>
              </div>

              {/* Review Cards list */}
              <div className={styles.reviewCards}>
                {PRODUCT_REVIEWS.map((rev) => (
                  <div key={rev.id} className={styles.reviewCard}>
                    <div className={styles.reviewCardTop}>
                      <div className={styles.reviewAuthorWrap}>
                        <div className={styles.authorAvatar}>
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <p className={styles.reviewAuthor}>{rev.author}</p>
                          <p className={styles.reviewMeta}>{rev.location} · {rev.date}</p>
                        </div>
                      </div>
                      {rev.verified && (
                        <span className={styles.verifiedBadge}>
                          <CheckCircle2 size={11} /> Verified Buyer
                        </span>
                      )}
                    </div>

                    <div className={styles.reviewCardStars}>
                      <div className={styles.starsRow}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="#C5A059" color="#C5A059" />
                        ))}
                      </div>
                      <span className={styles.reviewFitTag}>{rev.fit}</span>
                    </div>

                    <h4 className={styles.reviewHeading}>&ldquo;{rev.title}&rdquo;</h4>
                    <p className={styles.reviewText}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── You May Also Like (mobile horizontal scroll) ── */}
          {related.length > 0 && (
            <div className={styles.mRelated}>
              <div className={styles.mRelatedHead}>
                <h3 className={styles.mRelatedTitle}>You May Also Like</h3>
                <Link href={`/${product.category}`} className={styles.mRelatedViewAll}>View All</Link>
              </div>
              <div className={styles.mRelatedRow}>
                {related.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`} className={styles.mRelatedCard}>
                    <div className={styles.mRelatedImg}>
                      <Image
                        src={p.images.primary}
                        alt={p.name}
                        fill
                        sizes="140px"
                        className={styles.mRelatedImgInner}
                      />
                    </div>
                    <p className={styles.mRelatedName}>{p.name}</p>
                    <p className={styles.mRelatedPrice}>{p.priceFormatted}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ────────────────────────────────────────────────
            DESKTOP LAYOUT — hidden on mobile (≤ 768px)
        ──────────────────────────────────────────────── */}
        <div className={styles.inner}>
          <div className={styles.desktopOnly}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: categoryLabel, href: `/${product.category}` },
                { label: product.name },
              ]}
            />

            <div className={styles.layout}>
              {/* Gallery */}
              <div className={styles.galleryCol}>
                <ProductGallery
                  images={product.images.gallery}
                  productName={product.name}
                />
              </div>

              {/* Info Column */}
              <div className={styles.infoCol}>
                <div className={styles.infoTop}>
                  <p className={styles.brand}>Neels Designer Studio</p>
                  {product.collection && (
                    <Link
                      href={`/collections/${product.collectionSlug}`}
                      className={styles.collectionLink}
                    >
                      {product.collection}
                    </Link>
                  )}
                  <h1 className={styles.name}>{product.name}</h1>
                  
                  <div className={styles.dPriceRatingRow}>
                    <p className={styles.price}>{product.priceFormatted}</p>
                    <div className={styles.dRatingBadge}>
                      <div className={styles.starsRow}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill="#C5A059" color="#C5A059" />
                        ))}
                      </div>
                      <span className={styles.ratingText}>4.9 (42 reviews)</span>
                    </div>
                  </div>

                  {product.price !== null && (
                    <p className={styles.taxNote}>
                      All applicable taxes included. Complimentary insured shipping on bridal couture.
                    </p>
                  )}
                </div>

                <p className={styles.description}>{product.description}</p>

                {/* Size Selector */}
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onSelect={setSelectedSize}
                  onCustomSize={() => setCustomSizeOpen(true)}
                />

                {/* CTAs */}
                <div className={styles.ctas}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleAddToBag}
                  >
                    {addedToBag ? 'Added to Bag ✓' : 'Add to Bag'}
                  </button>
                  <Link
                    href="/checkout"
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      if (selectedSize) addToCart(product, selectedSize);
                    }}
                  >
                    Buy It Now
                  </Link>
                </div>

                {/* Short note to view cart */}
                {addedToBag && (
                  <div className={styles.addedNotice}>
                    <span>✓ Item added to your shopping bag.</span>
                    <Link href="/cart" className={styles.viewCartLink}>
                      View Cart →
                    </Link>
                  </div>
                )}

                {/* Fear-busting policies in Desktop info column */}
                <div className={styles.dTrustCol}>
                  <div className={styles.dTrustGrid}>
                    {TRUST_POLICIES.map((p) => {
                      const Icon = p.icon;
                      return (
                        <div key={p.id} className={styles.dTrustItem}>
                          <Icon size={18} strokeWidth={1.5} className={styles.dTrustIcon} />
                          <div>
                            <span className={styles.dTrustTitle}>{p.title}</span>
                            <span className={styles.dTrustDesc}>{p.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accordions */}
                <Accordion items={accordionItems} />

                {/* Share */}
                <div className={styles.share}>
                  <span className={styles.shareLabel}>Share Enquire</span>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.shareLink}
                    aria-label="Share on Instagram"
                  >
                    <InstagramIcon />
                    Instagram
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} on Neels Designer Studio`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.shareLink}
                    aria-label="Share on WhatsApp"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* ── DESKTOP FEAR-BUSTING ASSURANCE BANNER ── */}
            <div className={styles.dFullTrustBanner}>
              <div className={styles.dTrustBannerGrid}>
                {TRUST_POLICIES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className={styles.dTrustBannerCard}>
                      <div className={styles.dTrustBannerIcon}>
                        <Icon size={24} strokeWidth={1.5} />
                      </div>
                      <h4 className={styles.dTrustBannerHeading}>{item.title}</h4>
                      <p className={styles.dTrustBannerText}>{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── DESKTOP REVIEWS & SOCIAL PROOF SECTION ── */}
            <div className={styles.dReviewsSection}>
              <div className={styles.dReviewsHeader}>
                <div>
                  <span className={styles.dReviewsEyebrow}>Client Testimonials</span>
                  <h2 className={styles.dReviewsTitle}>What Connoisseurs Say</h2>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setReviewModalOpen(true)}
                >
                  Write a Client Review
                </button>
              </div>

              {/* Rating metrics row */}
              <div className={styles.dRatingMetrics}>
                <div className={styles.dScoreCol}>
                  <span className={styles.dScoreNum}>4.9</span>
                  <div className={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#C5A059" color="#C5A059" />
                    ))}
                  </div>
                  <p className={styles.dScoreCount}>Based on 42 Verified Purchases</p>
                </div>
                <div className={styles.dMetricBars}>
                  <div className={styles.dMetricItem}>
                    <span className={styles.dMetricLabel}>Embroidery & Craft</span>
                    <div className={styles.dBarTrack}><div className={styles.dBarFill} style={{ width: '99%' }} /></div>
                    <span className={styles.dMetricVal}>5.0</span>
                  </div>
                  <div className={styles.dMetricItem}>
                    <span className={styles.dMetricLabel}>Fabric & Raw Silk Quality</span>
                    <div className={styles.dBarTrack}><div className={styles.dBarFill} style={{ width: '98%' }} /></div>
                    <span className={styles.dMetricVal}>4.9</span>
                  </div>
                  <div className={styles.dMetricItem}>
                    <span className={styles.dMetricLabel}>Bespoke Fit Precision</span>
                    <div className={styles.dBarTrack}><div className={styles.dBarFill} style={{ width: '96%' }} /></div>
                    <span className={styles.dMetricVal}>4.8</span>
                  </div>
                </div>
              </div>

              {/* Review cards grid */}
              <div className={styles.dReviewsGrid}>
                {PRODUCT_REVIEWS.map((rev) => (
                  <div key={rev.id} className={styles.dReviewCard}>
                    <div className={styles.dReviewTop}>
                      <div className={styles.starsRow}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#C5A059" color="#C5A059" />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className={styles.verifiedBadge}>
                          <CheckCircle2 size={12} /> Verified Client
                        </span>
                      )}
                    </div>
                    <h3 className={styles.dReviewHeading}>&ldquo;{rev.title}&rdquo;</h3>
                    <p className={styles.dReviewComment}>{rev.comment}</p>
                    <div className={styles.dReviewFooter}>
                      <div>
                        <p className={styles.dReviewAuthor}>{rev.author}</p>
                        <p className={styles.dReviewLocation}>{rev.location} · {rev.date}</p>
                      </div>
                      <span className={styles.reviewFitTag}>{rev.fit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DESKTOP FAQ / Q&A DROPDOWNS SECTION ── */}
            <div className={styles.dFaqSection}>
              <div className={styles.dFaqHeader}>
                <span className={styles.dReviewsEyebrow}>Frequently Asked</span>
                <h2 className={styles.dReviewsTitle}>Questions & Answers</h2>
                <p className={styles.dFaqSubtitle}>
                  Everything you need to know about our atelier creations, bespoke fittings, and care instructions.
                </p>
              </div>

              <div className={styles.dFaqList}>
                {PRODUCT_FAQS.map((item) => {
                  const isOpen = openFaq === item.id;
                  return (
                    <div key={item.id} className={`${styles.dFaqItem} ${isOpen ? styles.dFaqItemActive : ''}`}>
                      <button
                        type="button"
                        className={styles.dFaqQuestion}
                        onClick={() => setOpenFaq(isOpen ? null : item.id)}
                        aria-expanded={isOpen}
                      >
                        <span className={styles.dFaqQText}>{item.q}</span>
                        <span className={styles.dFaqIcon}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className={styles.dFaqAnswer}>
                          <p>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
              <div className={styles.related}>
                <h2 className={styles.relatedTitle}>You May Also Like</h2>
                <ProductGrid products={related} columns={4} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review submission modal */}
      {reviewModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setReviewModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Write a Client Review</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setReviewModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {reviewSuccess ? (
              <div className={styles.modalSuccess}>
                <Check size={32} color="#4A7C59" />
                <p>Thank you for sharing your experience. Your review will be published shortly after atelier verification.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating</label>
                  <div className={styles.starSelectRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={styles.starSelectBtn}
                        onClick={() => setNewReviewRating(star)}
                      >
                        <Star
                          size={22}
                          fill={star <= newReviewRating ? '#C5A059' : 'transparent'}
                          color={star <= newReviewRating ? '#C5A059' : '#DCCFC8'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    className={styles.formInput}
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    className={styles.formInput}
                    value={newReviewCity}
                    onChange={(e) => setNewReviewCity(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Review</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the fabric quality, embroidery finish, fitting experience, or overall event impression..."
                    className={styles.formTextarea}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setReviewModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <CustomSizeModal
        isOpen={customSizeOpen}
        onClose={() => setCustomSizeOpen(false)}
        onSave={(_m) => {
          setSelectedSize('CUSTOM SIZE');
          setCustomSizeOpen(false);
        }}
      />

      <StylistModal
        isOpen={stylistOpen}
        onClose={() => setStylistOpen(false)}
        productName={product.name}
      />
    </>
  );
}
