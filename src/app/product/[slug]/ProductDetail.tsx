'use client';

import React, { useState } from 'react';
import Link from 'next/link';
function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
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

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({
  product,
  related,
}: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [customSizeOpen, setCustomSizeOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const { addToCart } = useCart();

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert('Please select a size to continue.');
      return;
    }
    addToCart(product, selectedSize);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 5000);
  };

  const categoryLabel = product.category === 'suits-dresses' ? 'Suits & Dresses' : product.category.charAt(0).toUpperCase() + product.category.slice(1);

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
        <div className={styles.inner}>
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

            {/* Info */}
            <div className={styles.infoCol}>
              <div className={styles.infoTop}>
                <p className={styles.brand}>Neels</p>
                {product.collection && (
                  <Link
                    href={`/collections/${product.collectionSlug}`}
                    className={styles.collectionLink}
                  >
                    {product.collection}
                  </Link>
                )}
                <h1 className={styles.name}>{product.name}</h1>
                <p className={styles.price}>{product.priceFormatted}</p>
                {product.price !== null && (
                  <p className={styles.taxNote}>
                    All applicable taxes are included. Shipping and duties are calculated at checkout.
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

              {/* Accordions */}
              <Accordion items={accordionItems} />

              {/* Share */}
              <div className={styles.share}>
                <span className={styles.shareLabel}>Share</span>
                <a
                  href={`https://instagram.com`}
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

          {/* Related Products */}
          {related.length > 0 && (
            <div className={styles.related}>
              <h2 className={styles.relatedTitle}>You May Also Like</h2>
              <ProductGrid products={related} columns={4} />
            </div>
          )}
        </div>
      </div>

      <CustomSizeModal
        isOpen={customSizeOpen}
        onClose={() => setCustomSizeOpen(false)}
        onSave={(m) => {
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
