'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
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

// Fields that belong to each tab — drives the per-tab validity indicator
const TAB_FIELDS: Record<TabKey, (keyof ProductFormData)[]> = {
  identity: ['name', 'slug', 'brand', 'category_slug', 'description'],
  pricing: ['price_formatted'],
  media: ['image_primary'],
  craft: ['sizes', 'fabric', 'care', 'details'],
  merchandising: ['is_active', 'is_new', 'is_featured'],
};

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
  const [visitedTabs, setVisitedTabs] = useState<Set<TabKey>>(new Set(['identity']));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [validationBanner, setValidationBanner] = useState<string | null>(null);
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
    trigger,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    mode: 'onChange',
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

  // Watch all values for per-tab completion checks
  const watchedValues = watch();

  // Per-tab validity: mirrors the Zod schema requirements per section
  const tabValidity = useMemo<Record<TabKey, boolean>>(() => {
    const v = watchedValues;
    return {
      identity:
        typeof v.name === 'string' && v.name.trim().length >= 2 &&
        typeof v.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.slug) &&
        typeof v.brand === 'string' && v.brand.trim().length >= 1 &&
        typeof v.category_slug === 'string' && v.category_slug.length >= 1 &&
        typeof v.description === 'string' && v.description.trim().length >= 10,
      pricing:
        isPriceOnRequest
          ? true
          : typeof v.price === 'number' && v.price > 0 &&
            typeof v.price_formatted === 'string' && v.price_formatted.length >= 1,
      media:
        typeof v.image_primary === 'string' && v.image_primary.length >= 1,
      craft:
        Array.isArray(v.sizes) && v.sizes.length >= 1 &&
        typeof v.fabric === 'string' && v.fabric.trim().length >= 2 &&
        typeof v.care === 'string' && v.care.trim().length >= 2 &&
        Array.isArray(v.details) && v.details.length >= 1,
      merchandising: true, // booleans — always valid once visited
    };
  }, [watchedValues, isPriceOnRequest]);

  const allTabsVisited = TABS.every((t) => visitedTabs.has(t.key));
  const allTabsValid = TABS.every((t) => tabValidity[t.key]);
  // Create mode: gated. Edit/Clone mode: open.
  const canSubmit = isEditing || isClone
    ? !isSubmitting
    : !isSubmitting && allTabsVisited && allTabsValid;

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
      setValidationBanner(null);
      setActiveTab('identity');
      setVisitedTabs(new Set(['identity']));
      setSlugLocked(!!initialData && !isClone);
    }
  }, [isOpen, initialData, isClone, reset, categories]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => new Set([...prev, tab]));
    setValidationBanner(null);
  };

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
    // For create mode, ensure all tabs visited + valid before proceeding
    if (!isEditing && !isClone) {
      const invalidTabs = TABS.filter((t) => !tabValidity[t.key]).map((t) => t.label);
      const unvisitedTabs = TABS.filter((t) => !visitedTabs.has(t.key)).map((t) => t.label);
      const problem = [...new Set([...unvisitedTabs, ...invalidTabs])];
      if (problem.length > 0) {
        const firstFailing = TABS.find((t) => !tabValidity[t.key] || !visitedTabs.has(t.key));
        if (firstFailing) setActiveTab(firstFailing.key);
        setValidationBanner(`Please complete: ${problem.join(', ')}`);
        return;
      }
    }
    try {
      setIsSubmitting(true);
      setServerError(null);
      setValidationBanner(null);
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

  const handleBlockedSubmitClick = async () => {
    await trigger();
    const invalidTabs = TABS.filter((t) => !tabValidity[t.key]).map((t) => t.label);
    const unvisitedTabs = TABS.filter((t) => !visitedTabs.has(t.key)).map((t) => t.label);
    const problem = [...new Set([...unvisitedTabs, ...invalidTabs])];
    const firstFailing = TABS.find((t) => !tabValidity[t.key] || !visitedTabs.has(t.key));
    if (firstFailing) handleTabChange(firstFailing.key);
    if (problem.length > 0) {
      setValidationBanner(`Complete these sections first: ${problem.join(', ')}`);
    }
  };

  if (!isOpen) return null;

  const modalTitle = isClone
    ? `Clone: ${initialData?.name}`
    : isEditing
    ? `Edit Product: ${initialData?.name}`
    : 'Create New Product';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111111]/60 backdrop-blur-[2px]">
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[8px] max-w-3xl w-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E1DA] shrink-0 bg-[#FFFFFF]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h2
                className="text-[23px] font-normal text-[#171717] tracking-tight leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {modalTitle}
              </h2>
              {!isEditing && !isClone && (
                <span
                  className={`shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border ${
                    allTabsValid && allTabsVisited
                      ? 'bg-[#F0F7F3] border-[#C3E6D3] text-[#2D6A4F]'
                      : 'bg-[#F7F6F2] border-[#E4E1DA] text-[#68655F]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {TABS.filter((t) => visitedTabs.has(t.key) && tabValidity[t.key]).length}/{TABS.length} done
                </span>
              )}
            </div>
            <p
              className="text-[11px] text-[#817D76] mt-1 font-normal tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isClone
                ? 'Creating a draft clone — images are reused, metadata is independent'
                : !isEditing
                ? 'Fill all 5 sections to unlock Create Product'
                : 'Configure product attributes, media, and merchandising signals'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="ml-4 shrink-0 w-8 h-8 flex items-center justify-center text-[#99958D] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[6px] border border-transparent hover:border-[#E4E1DA] transition-colors duration-150 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E4E1DA] shrink-0 overflow-x-auto px-6 bg-[#FFFFFF] gap-1">
          {TABS.map((tab) => {
            const visited = visitedTabs.has(tab.key);
            const valid = tabValidity[tab.key];
            const isActive = activeTab === tab.key;
            const showProgress = !isEditing && !isClone;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-1.5 py-2.5 px-2 text-[10.5px] uppercase tracking-[0.1em] font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 ${
                  isActive
                    ? 'border-[#171717] text-[#171717]'
                    : 'border-transparent text-[#99958D] hover:text-[#171717]'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {tab.label}
                {showProgress && visited && (
                  <span className="shrink-0">
                    {valid
                      ? <CheckCircle2 size={11} className="text-[#2D6A4F]" />
                      : <XCircle size={11} className="text-[#A93226]" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Error Banner */}
        {serverError && (
          <div
            className="mx-6 mt-3 px-4 py-2.5 bg-[#FDF2F2] border border-[#F0C9C9] rounded-[6px] text-[11.5px] text-[#A93226] flex items-start gap-2.5 shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>{serverError}</span>
          </div>
        )}

        {/* Validation Banner */}
        {validationBanner && (
          <div
            className="mx-6 mt-3 px-4 py-2.5 bg-[#FEFAF0] border border-[#F0DFA8] rounded-[6px] text-[11.5px] text-[#7A6200] flex items-start gap-2.5 shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>{validationBanner}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="px-6 py-4 space-y-3.5 flex-1 overflow-y-auto bg-[#FFFFFF]">
            {/* ===== TAB: IDENTITY ===== */}
            {activeTab === 'identity' && (
              <div className="space-y-3.5">
                {/* Name */}
                <div className="space-y-1">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Product Name <span className="text-[#A93226]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Ivory Embroidered Lehenga"
                    {...register('name')}
                    onChange={handleNameChange}
                    disabled={isSubmitting}
                    className="w-full h-[38px] px-3.5 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {errors.name && <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.name.message}</p>}
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Slug (Primary Key) <span className="text-[#A93226]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSlugLocked(!slugLocked)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1 text-[10.5px] text-[#99958D] hover:text-[#171717] font-medium transition-colors duration-150"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <span>{slugLocked ? '[Locked]' : '[Editing]'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. heritage-ivory-embroidered-lehenga"
                    {...register('slug')}
                    disabled={isSubmitting || (slugLocked && isEditing)}
                    className="w-full h-[38px] px-3.5 text-[12.5px] font-mono rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] disabled:opacity-50 transition-colors duration-150"
                  />
                  {errors.slug && <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.slug.message}</p>}
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label
                      className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Brand <span className="text-[#A93226]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Neels"
                      {...register('brand')}
                      disabled={isSubmitting}
                      className="w-full h-[38px] px-3.5 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    {errors.brand && <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.brand.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label
                      className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Category <span className="text-[#A93226]">*</span>
                    </label>
                    <select
                      {...register('category_slug')}
                      disabled={isSubmitting}
                      className="w-full h-[38px] px-3 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
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
                      <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.category_slug.message}</p>
                    )}
                  </div>
                </div>

                {/* Collection */}
                <div className="space-y-1">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Collection (Optional)
                  </label>
                  <select
                    {...register('collection_slug')}
                    disabled={isSubmitting}
                    className="w-full h-[38px] px-3 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
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

                {/* Description */}
                <div className="space-y-1">
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Product Description <span className="text-[#A93226]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short evocative description for product cards and overview..."
                    {...register('description')}
                    disabled={isSubmitting}
                    className="w-full p-3 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] resize-none transition-colors duration-150"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {errors.description && (
                    <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* ===== TAB: PRICING ===== */}
            {activeTab === 'pricing' && (
              <div className="space-y-3.5">
                {/* Price on Request toggle */}
                <div className="flex items-start gap-3 p-3.5 bg-[#F7F6F2] border border-[#E4E1DA] rounded-[6px]">
                  <input
                    type="checkbox"
                    id="price-on-request"
                    checked={isPriceOnRequest}
                    onChange={(e) => handlePriceOnRequestToggle(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-0.5 rounded text-[#111111] focus:ring-0"
                  />
                  <div>
                    <label
                      htmlFor="price-on-request"
                      className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Price on Request
                    </label>
                    <p className="text-[11px] text-[#99958D] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Used for bespoke bridal pieces or highly exclusive items where a fixed price isn't displayed
                    </p>
                  </div>
                </div>

                {!isPriceOnRequest && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Numeric price input */}
                    <div className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Price (₹) <span className="text-[#A93226]">*</span>
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99958D] text-[13px] font-normal"
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
                          className="w-full h-[38px] pl-8 pr-3.5 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.price.message}</p>
                      )}
                    </div>

                    {/* Formatted preview */}
                    <div className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Formatted Preview
                      </label>
                      <div
                        className="px-3.5 bg-[#F3F0E9] rounded-[6px] border border-[#E4E1DA] text-[15px] font-serif font-medium text-[#171717] h-[38px] flex items-center"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {watch('price_formatted') || (
                          <span className="text-[#99958D] italic text-[11px] font-sans font-normal">Auto-generated from price above</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isPriceOnRequest && (
                  <div
                    className="p-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-[6px] text-[11px] text-[#68655F] font-medium uppercase tracking-wider"
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
              <div className="space-y-3.5">
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
                <div className="p-4 bg-[#FFFFFF] border border-[#E4E1DA] rounded-[6px] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Fabric & Textiles <span className="text-[#A93226]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Handwoven Banarasi silk"
                        {...register('fabric')}
                        disabled={isSubmitting}
                        className="w-full h-[38px] px-3.5 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {errors.fabric && <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.fabric.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label
                        className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Care Instructions <span className="text-[#A93226]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dry clean only. Store in breathable cotton bag."
                        {...register('care')}
                        disabled={isSubmitting}
                        className="w-full h-[38px] px-3.5 text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] transition-colors duration-150"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {errors.care && <p className="text-[11px] text-[#A93226]" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.care.message}</p>}
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
              <div className="space-y-2.5">
                {/* is_active */}
                <div className="flex items-start gap-3.5 p-4 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#171717]/30 rounded-[6px] transition-colors duration-150">
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
                        className="mt-0.5 rounded text-[#111111] focus:ring-0"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="is-active"
                      className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Published & Live
                    </label>
                    <p className="text-[11px] text-[#99958D] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Product is publicly visible on the storefront. Uncheck to keep it as a Draft.
                    </p>
                  </div>
                </div>

                {/* is_featured */}
                <div className="flex items-start gap-3.5 p-4 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#171717]/30 rounded-[6px] transition-colors duration-150">
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
                        className="mt-0.5 rounded text-[#111111] focus:ring-0"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="is-featured"
                      className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Featured Showcase Piece
                    </label>
                    <p className="text-[11px] text-[#99958D] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Includes this product in homepage featured grids and editorial spotlights.
                    </p>
                  </div>
                </div>

                {/* is_new */}
                <div className="flex items-start gap-3.5 p-4 bg-[#FFFFFF] border border-[#E4E1DA] hover:border-[#171717]/30 rounded-[6px] transition-colors duration-150">
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
                        className="mt-0.5 rounded text-[#111111] focus:ring-0"
                      />
                    )}
                  />
                  <div>
                    <label
                      htmlFor="is-new"
                      className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#171717] cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      New Arrival Badge
                    </label>
                    <p className="text-[11px] text-[#99958D] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Displays a "New" badge on this product in listing grids.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-[#E4E1DA] flex items-center justify-between gap-4 shrink-0 bg-[#FFFFFF]">
            {/* Tab navigation shortcuts */}
            <div className="flex items-center gap-4">
              {activeTab !== 'identity' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex((t) => t.key === activeTab);
                    if (idx > 0) handleTabChange(TABS[idx - 1].key);
                  }}
                  className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#68655F] hover:text-[#171717] transition-colors duration-150"
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
                    if (idx < TABS.length - 1) handleTabChange(TABS[idx + 1].key);
                  }}
                  className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#68655F] hover:text-[#171717] transition-colors duration-150"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  NEXT →
                </button>
              )}
            </div>

            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-[38px] min-w-[85px] px-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#111111] hover:bg-[#EAE7E0] hover:text-[#111111] bg-[#FFFFFF] rounded-[6px] border border-[#111111] transition-colors duration-150 disabled:opacity-50 flex items-center justify-center shadow-xs cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Cancel
              </button>
              {canSubmit ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 h-[38px] min-w-[145px] px-6 text-[11px] font-semibold uppercase tracking-[0.08em] bg-[#111111] text-[#FFFFFF] hover:bg-[#2A2725] border border-[#111111] rounded-[6px] transition-colors duration-150 disabled:opacity-50 shadow-xs cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>{isClone ? 'Save Clone' : isEditing ? 'Save Changes' : 'Create Product'}</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBlockedSubmitClick}
                  title={`Complete all sections to unlock: ${TABS.filter((t) => !visitedTabs.has(t.key) || !tabValidity[t.key]).map((t) => t.label).join(', ')}`}
                  className="inline-flex items-center justify-center gap-2 h-[38px] min-w-[145px] px-6 text-[11px] font-semibold uppercase tracking-[0.08em] bg-[#E8E5DF] text-[#99958D] border border-[#D4D0C8] rounded-[6px] transition-colors duration-150 cursor-not-allowed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span>Create Product</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
