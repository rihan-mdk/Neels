'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, AlertCircle, Lock, Unlock } from 'lucide-react';
import {
  ProductFormSchema,
  ProductFormData,
  ProductRecord,
} from '@/lib/validations/product.schema';
import ProductMediaUploader from './ProductMediaUploader';
import ProductDetailsEditor from './ProductDetailsEditor';
import ProductSizesSelector from './ProductSizesSelector';

interface CategoryOption { slug: string; name: string; }
interface CollectionOption { slug: string; name: string; }

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: ProductFormData,
    files: { primary?: File; hover?: File; galleryNew?: File[] },
    removedImageUrls: string[]
  ) => Promise<void>;
  initialData?: ProductRecord | null;
  categories: CategoryOption[];
  collections: CollectionOption[];
  isClone?: boolean;
}

type TabKey = 'identity' | 'pricing' | 'media' | 'craft' | 'merchandising';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'identity', label: 'Identity' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'media', label: 'Media' },
  { key: 'craft', label: 'Craft & Sizing' },
  { key: 'merchandising', label: 'Merchandising' },
];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  collections,
  isClone = false,
}: ProductFormModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(!!initialData && !isClone);
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(
    initialData ? initialData.price === null : false
  );

  // Media file state
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [hoverFile, setHoverFile] = useState<File | null>(null);
  const [galleryNewFiles, setGalleryNewFiles] = useState<File[]>([]);
  const [galleryExistingUrls, setGalleryExistingUrls] = useState<string[]>(
    initialData?.image_gallery || []
  );
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  const isEditing = !!initialData && !isClone;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      brand: 'Neels',
      category_slug: '',
      collection_slug: null,
      price: undefined,
      price_formatted: '',
      image_primary: '',
      image_hover: null,
      image_gallery: [],
      sizes: [],
      description: '',
      details: [],
      fabric: '',
      care: '',
      is_new: false,
      is_featured: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: isClone ? `${initialData.name} (Copy)` : initialData.name,
          slug: isClone ? `${initialData.slug}-copy` : initialData.slug,
          brand: initialData.brand || 'Neels',
          category_slug: initialData.category_slug,
          collection_slug: initialData.collection_slug ?? null,
          price: initialData.price ?? undefined,
          price_formatted: initialData.price_formatted,
          image_primary: initialData.image_primary,
          image_hover: initialData.image_hover ?? null,
          image_gallery: initialData.image_gallery || [],
          sizes: initialData.sizes || [],
          description: initialData.description,
          details: initialData.details || [],
          fabric: initialData.fabric,
          care: initialData.care,
          is_new: isClone ? false : initialData.is_new,
          is_featured: isClone ? false : initialData.is_featured,
          is_active: isClone ? true : initialData.is_active,
        });
        setIsPriceOnRequest(initialData.price === null);
        setGalleryExistingUrls(initialData.image_gallery || []);
      } else {
        reset({
          name: '',
          slug: '',
          brand: 'Neels',
          category_slug: categories[0]?.slug || '',
          collection_slug: null,
          price: undefined,
          price_formatted: '',
          image_primary: '',
          image_hover: null,
          image_gallery: [],
          sizes: ['M'],
          description: '',
          details: [],
          fabric: '',
          care: '',
          is_new: false,
          is_featured: false,
          is_active: true,
        });
        setIsPriceOnRequest(false);
        setGalleryExistingUrls([]);
      }
      setPrimaryFile(null);
      setHoverFile(null);
      setGalleryNewFiles([]);
      setRemovedImageUrls([]);
      setServerError(null);
      setActiveTab('identity');
      setSlugLocked(!!initialData && !isClone);
    }
  }, [isOpen, initialData, isClone, reset, categories]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val, { shouldValidate: true });
    if (!slugLocked && (!isEditing || isClone)) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generated, { shouldValidate: true });
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || isNaN(Number(val))) {
      setValue('price', undefined);
      setValue('price_formatted', '');
    } else {
      const num = Number(val);
      setValue('price', num, { shouldValidate: true });
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
      setValue('price_formatted', formatted, { shouldValidate: true });
    }
  };

  const handlePriceOnRequestToggle = (checked: boolean) => {
    setIsPriceOnRequest(checked);
    if (checked) {
      setValue('price', null);
      setValue('price_formatted', 'PRICE ON REQUEST');
    } else {
      setValue('price', undefined);
      setValue('price_formatted', '');
    }
  };

  const handleGalleryChanged = (
    newFiles: File[],
    existingUrls: string[],
    removed: string[]
  ) => {
    setGalleryNewFiles(newFiles);
    setGalleryExistingUrls(existingUrls);
    setRemovedImageUrls(removed);
    setValue('image_gallery', existingUrls, { shouldValidate: true });
  };

  const onFormSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await onSubmit(
        data,
        {
          primary: primaryFile || undefined,
          hover: hoverFile || undefined,
          galleryNew: galleryNewFiles.length > 0 ? galleryNewFiles : undefined,
        },
        removedImageUrls
      );
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalTitle = isClone
    ? `Clone: ${initialData?.name}`
    : isEditing
    ? `Edit Product: ${initialData?.name}`
    : 'Create New Product';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D0D0D]/60">
      <div className="bg-[#FFFFFF] border border-[#E7E4DD] rounded-[4px] max-w-4xl w-full shadow-xl flex flex-col max-h-[92vh] h-[92vh] md:h-[840px] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#E7E4DD] shrink-0 bg-[#FFFFFF]">
          <div>
            <h2
              className="text-[24px] font-light text-[#171717] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {modalTitle}
            </h2>
            <p
              className="text-[10px] text-[#9B9891] mt-0.5 font-normal tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isClone
                ? 'Creating a draft clone — images are reused, metadata is independent'
                : 'Configure all product attributes, media, and merchandising signals'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-[#9B9891] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[3px] transition-colors duration-150"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E7E4DD] shrink-0 overflow-x-auto px-8 bg-[#F3F0E9] gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 text-[10px] uppercase tracking-[0.14em] font-normal whitespace-nowrap border-b-2 transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'border-[#171717] text-[#171717]'
                  : 'border-transparent text-[#9B9891] hover:text-[#6F6D68]'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {serverError && (
          <div
            className="mx-8 mt-4 px-4 py-3 bg-[#FDF2F2] border border-[#F0C9C9] rounded-[3px] text-[11px] text-[#A93226] flex items-start gap-2.5 shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <AlertCircle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="px-8 py-6 space-y-5 flex-1 overflow-y-auto bg-[#FFFFFF]">
            {/* ===== TAB: IDENTITY ===== */}
            {activeTab === 'identity' && (
              <div className="p-6 bg-[#FFFFFF] border border-[#E7E4DD] rounded-[4px] space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Product Name <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Ivory Embroidered Lehenga"
                    {...register('name')}
                    onChange={handleNameChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {errors.name && <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.name.message}</p>}
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Slug (Primary Key) <span className="text-[#C0392B]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSlugLocked(!slugLocked)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1 text-[10px] text-[#9B9891] hover:text-[#171717] transition-colors duration-150"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {slugLocked ? <Lock size={11} strokeWidth={1.5} /> : <Unlock size={11} strokeWidth={1.5} />}
                      <span>{slugLocked ? 'Locked' : 'Editing'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. heritage-ivory-embroidered-lehenga"
                    {...register('slug')}
                    disabled={isSubmitting || (slugLocked && isEditing)}
                    className="w-full px-3 py-2.5 text-[12px] font-mono rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] disabled:opacity-50 transition-colors duration-150"
                  />
                  {errors.slug && <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.slug.message}</p>}
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Brand <span className="text-[#C0392B]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Neels"
                    {...register('brand')}
                    disabled={isSubmitting}
                    className="w-full sm:w-64 px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {errors.brand && <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.brand.message}</p>}
                </div>

                {/* Category & Collection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Category <span className="text-[#C0392B]">*</span>
                    </label>
                    <select
                      {...register('category_slug')}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_slug && (
                      <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.category_slug.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Collection (Optional)
                    </label>
                    <select
                      {...register('collection_slug')}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="">No collection</option>
                      {collections.map((col) => (
                        <option key={col.slug} value={col.slug}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label
                    className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Product Description <span className="text-[#C0392B]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short evocative description for product cards and overview..."
                    {...register('description')}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] resize-none transition-colors duration-150"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {errors.description && (
                    <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* ===== TAB: PRICING ===== */}
            {activeTab === 'pricing' && (
              <div className="p-6 bg-[#FFFFFF] border border-[#E7E4DD] rounded-[4px] space-y-4">
                {/* Price on Request toggle */}
                <div className="flex items-start gap-3.5 p-4 bg-[#F7F6F2] border border-[#E7E4DD] rounded-[3px]">
                  <input
                    type="checkbox"
                    id="price-on-request"
                    checked={isPriceOnRequest}
                    onChange={(e) => handlePriceOnRequestToggle(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-0.5 rounded text-[#101010]"
                  />
                  <div>
                    <label
                      htmlFor="price-on-request"
                      className="text-[11px] font-normal uppercase tracking-[0.1em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Price on Request
                    </label>
                    <p className="text-[10px] text-[#9B9891] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Used for bespoke bridal pieces or highly exclusive items where a fixed price isn't displayed
                    </p>
                  </div>
                </div>

                {!isPriceOnRequest && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Numeric price input */}
                    <div className="space-y-1.5">
                      <label
                        className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Price (₹) <span className="text-[#C0392B]">*</span>
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9891] text-[12px] font-normal"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          ₹
                        </span>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          placeholder="195000"
                          onChange={handlePriceChange}
                          defaultValue={initialData?.price ?? undefined}
                          disabled={isSubmitting}
                          className="w-full pl-7 pr-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.price.message}</p>
                      )}
                    </div>

                    {/* Formatted preview */}
                    <div className="space-y-1.5">
                      <label
                        className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Formatted Preview
                      </label>
                      <div
                        className="px-3 py-2.5 bg-[#F7F6F2] rounded-[3px] border border-[#E7E4DD] text-[12px] font-normal text-[#171717] h-[38px] flex items-center"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {watch('price_formatted') || (
                          <span className="text-[#99958D] italic text-[11px]">Auto-generated from price above</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isPriceOnRequest && (
                  <div
                    className="p-3 bg-[#F7F6F2] border border-[#E7E4DD] rounded-[3px] text-[11px] text-[#6F6D68] font-normal uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Price will display as "PRICE ON REQUEST" on the storefront
                  </div>
                )}
              </div>
            )}

            {/* ===== TAB: MEDIA ===== */}
            {activeTab === 'media' && (
              <ProductMediaUploader
                initialPrimaryUrl={initialData?.image_primary}
                initialHoverUrl={initialData?.image_hover ?? undefined}
                initialGalleryUrls={initialData?.image_gallery}
                onPrimarySelected={(file) => {
                  setPrimaryFile(file);
                  if (file) setValue('image_primary', 'pending_upload', { shouldValidate: true });
                  else setValue('image_primary', initialData?.image_primary || '', { shouldValidate: true });
                }}
                onHoverSelected={(file) => {
                  setHoverFile(file);
                  if (file) setValue('image_hover', 'pending_upload');
                  else setValue('image_hover', initialData?.image_hover ?? null);
                }}
                onGalleryChanged={handleGalleryChanged}
                primaryError={errors.image_primary?.message}
                disabled={isSubmitting}
              />
            )}

            {/* ===== TAB: CRAFT & SIZING ===== */}
            {activeTab === 'craft' && (
              <div className="space-y-5">
                {/* Sizes Selector */}
                <Controller
                  control={control}
                  name="sizes"
                  render={({ field }) => (
                    <ProductSizesSelector
                      selectedSizes={field.value}
                      onChange={field.onChange}
                      error={errors.sizes?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />

                {/* Fabric & Care Card */}
                <div className="p-6 bg-[#FFFFFF] border border-[#E7E4DD] rounded-[4px] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Fabric & Textiles <span className="text-[#C0392B]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Handwoven Banarasi silk"
                        {...register('fabric')}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {errors.fabric && <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.fabric.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Care Instructions <span className="text-[#C0392B]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dry clean only. Store in breathable cotton bag."
                        {...register('care')}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2.5 text-[12px] rounded-[3px] border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D] focus:outline-none focus:border-[#171717] transition-colors duration-150"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {errors.care && <p className="text-[10px] text-[#C0392B]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.care.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Craftsmanship Details */}
                <Controller
                  control={control}
                  name="details"
                  render={({ field }) => (
                    <ProductDetailsEditor
                      details={field.value}
                      onChange={field.onChange}
                      error={errors.details?.message}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
            )}

            {/* ===== TAB: MERCHANDISING ===== */}
            {activeTab === 'merchandising' && (
              <div className="space-y-3">
                {/* is_active */}
                <div className="flex items-start gap-4 p-5 bg-[#FFFFFF] border border-[#E7E4DD] hover:border-[#171717]/20 rounded-[4px] transition-colors duration-150">
                  <Controller
                    control={control}
                    name="is_active"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="is-active"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                        className="mt-1 rounded text-[#101010]"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="is-active"
                      className="text-[11px] font-normal uppercase tracking-[0.12em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Published & Live
                    </label>
                    <p className="text-[10px] text-[#9B9891] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Product is publicly visible on the storefront. Uncheck to keep it as a Draft.
                    </p>
                  </div>
                </div>

                {/* is_featured */}
                <div className="flex items-start gap-4 p-5 bg-[#FFFFFF] border border-[#E7E4DD] hover:border-[#171717]/20 rounded-[4px] transition-colors duration-150">
                  <Controller
                    control={control}
                    name="is_featured"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="is-featured"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                        className="mt-1 rounded text-[#101010]"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="is-featured"
                      className="text-[11px] font-normal uppercase tracking-[0.12em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Featured Showcase Piece
                    </label>
                    <p className="text-[10px] text-[#9B9891] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Includes this product in homepage featured grids and editorial spotlights.
                    </p>
                  </div>
                </div>

                {/* is_new */}
                <div className="flex items-start gap-4 p-5 bg-[#FFFFFF] border border-[#E7E4DD] hover:border-[#171717]/20 rounded-[4px] transition-colors duration-150">
                  <Controller
                    control={control}
                    name="is_new"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="is-new"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                        className="mt-1 rounded text-[#101010]"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="is-new"
                      className="text-[11px] font-normal uppercase tracking-[0.12em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      New Arrival Badge
                    </label>
                    <p className="text-[10px] text-[#9B9891] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Displays a "New" badge on this product in listing grids.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-[#E7E4DD] flex items-center justify-between gap-4 shrink-0 bg-[#FFFFFF]">
            {/* Tab navigation shortcuts */}
            <div className="flex items-center gap-4">
              {activeTab !== 'identity' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex((t) => t.key === activeTab);
                    if (idx > 0) setActiveTab(TABS[idx - 1].key);
                  }}
                  className="text-[10px] uppercase tracking-[0.12em] font-normal text-[#9B9891] hover:text-[#171717] transition-colors duration-150"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ← PREV
                </button>
              )}
              {activeTab !== 'merchandising' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex((t) => t.key === activeTab);
                    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
                  }}
                  className="text-[10px] uppercase tracking-[0.12em] font-normal text-[#9B9891] hover:text-[#171717] transition-colors duration-150"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  NEXT →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-[34px] px-4 text-[10px] font-normal uppercase tracking-[0.12em] text-[#6F6D68] hover:text-[#171717] bg-[#F7F6F2] hover:bg-[#EEECE7] rounded-[3px] border border-[#E4E1DA] transition-colors duration-150 disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 h-[34px] px-5 text-[10px] font-normal uppercase tracking-[0.12em] text-white bg-[#111111] hover:bg-[#262626] rounded-[3px] transition-colors duration-150 disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isSubmitting && <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />}
                <span>
                  {isClone ? 'Save Clone' : isEditing ? 'Save Changes' : 'CREATE PRODUCT'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
