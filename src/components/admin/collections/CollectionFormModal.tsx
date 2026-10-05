'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, AlertCircle } from 'lucide-react';
import {
  CollectionFormSchema,
  CollectionFormData,
  CollectionRecord,
} from '@/lib/validations/collection.schema';
import SingleImageUploader from '@/components/admin/common/SingleImageUploader';

interface CollectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CollectionFormData, file?: File) => Promise<void>;
  initialData?: CollectionRecord | null;
  defaultOrder?: number;
}

const SEASON_PRESETS = [
  'Perennial',
  'SS 2026',
  'AW 2026',
  'Limited Edition',
  'Couture',
  'By Appointment',
  'Festive',
];

export default function CollectionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultOrder = 0,
}: CollectionFormModalProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [autoSlug, setAutoSlug] = useState(!initialData);

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(CollectionFormSchema),
    defaultValues: {
      name: '',
      short_name: '',
      slug: '',
      season: 'Perennial',
      description: '',
      long_description: '',
      display_order: defaultOrder,
      image: '',
    },
  });

  const watchSeason = watch('season');

  useEffect(() => {
    if (isOpen) {
      setServerError(null);
      setSelectedImageFile(null);
      if (initialData) {
        setAutoSlug(false);
        reset({
          name: initialData.name,
          short_name: initialData.short_name,
          slug: initialData.slug,
          season: initialData.season || 'Perennial',
          description: initialData.description,
          long_description: initialData.long_description,
          display_order: initialData.display_order,
          image: initialData.image,
        });
      } else {
        setAutoSlug(true);
        reset({
          name: '',
          short_name: '',
          slug: '',
          season: 'Perennial',
          description: '',
          long_description: '',
          display_order: defaultOrder,
          image: '',
        });
      }
    }
  }, [isOpen, initialData, defaultOrder, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val, { shouldValidate: true });
    if (autoSlug) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
      if (!watch('short_name') || watch('short_name') === '') {
        setValue('short_name', val.replace(/^The\s+/i, ''));
      }
    }
  };

  const handleSlugManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    setValue('slug', e.target.value, { shouldValidate: true });
  };

  const handleImageSelected = (file: File | null) => {
    setSelectedImageFile(file);
    if (file) {
      setValue('image', 'pending_upload', { shouldValidate: true });
    } else {
      setValue('image', initialData?.image || '', { shouldValidate: true });
    }
  };

  const onFormSubmit = async (data: CollectionFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await onSubmit(data, selectedImageFile || undefined);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0D0D0D]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[6px] max-w-[720px] w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-5 sm:px-6 pb-4 border-b border-[#E4E1DA] shrink-0 bg-[#FFFFFF]">
          <div>
            <h2
              className="text-[24px] font-normal text-[#171717] tracking-tight leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {isEditing ? `Edit Collection: ${initialData.name}` : 'Create New Collection'}
            </h2>
            <p
              className="text-[12px] text-[#68655F] mt-1 font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Configure seasonal couture story, curatorial notes, and editorial imagery
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-[#99958D] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[3px] transition-colors cursor-pointer"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div
            className="mx-6 mt-4 p-3 bg-[#FDF2F2] border border-[#F0C9C9] rounded-[4px] text-[11px] text-[#A93226] flex items-start gap-2 shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <AlertCircle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form with Dedicated Scrollable Body & Fixed Footer */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
            {/* Row 1: Name & Short Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Collection Title <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Heritage Edit"
                  {...register('name')}
                  onChange={handleNameChange}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-[38px] text-[12px] rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {errors.name && (
                  <p className="text-[10.5px] text-[#C0392B]">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Short Name <span className="text-[#C0392B]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heritage Edit"
                  {...register('short_name')}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-[38px] text-[12px] rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {errors.short_name && (
                  <p className="text-[10.5px] text-[#C0392B]">{errors.short_name.message}</p>
                )}
              </div>
            </div>

            {/* Row 2: Slug & Season Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Slug (Primary Key) <span className="text-[#C0392B]">*</span>
                  </label>
                  {autoSlug && (
                    <span className="text-[10px] text-[#99958D] font-normal">Auto-syncing</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. the-heritage-edit"
                  {...register('slug')}
                  onChange={handleSlugManualChange}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-[38px] text-[12px] font-mono rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B]"
                />
                {errors.slug && (
                  <p className="text-[10.5px] text-[#C0392B]">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Season / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. AW 2026, Perennial, Limited Edition"
                  {...register('season')}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-[38px] text-[12px] rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {/* Season quick chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SEASON_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setValue('season', preset, { shouldValidate: true })}
                      className={`px-2 py-0.5 text-[10px] rounded-[3px] border transition-colors font-medium cursor-pointer ${
                        watchSeason === preset
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-[#F7F6F2] text-[#68655F] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                {errors.season && (
                  <p className="text-[10.5px] text-[#C0392B]">{errors.season.message}</p>
                )}
              </div>
            </div>

            {/* Row 3: Display Order */}
            <div className="space-y-1.5">
              <label
                className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Display Order
              </label>
              <input
                type="number"
                min={0}
                {...register('display_order', { valueAsNumber: true })}
                disabled={isSubmitting}
                className="w-32 px-3.5 h-[38px] text-[12px] font-mono rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] focus:outline-none focus:border-[#55514B]"
              />
              {errors.display_order && (
                <p className="text-[10.5px] text-[#C0392B]">{errors.display_order.message}</p>
              )}
            </div>

            {/* Row 4: Summary Description */}
            <div className="space-y-1.5">
              <label
                className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Summary Description <span className="text-[#C0392B]">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Brief essence of the collection for cards and highlights..."
                {...register('description')}
                disabled={isSubmitting}
                className="w-full p-3 text-[12px] rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              {errors.description && (
                <p className="text-[10.5px] text-[#C0392B]">{errors.description.message}</p>
              )}
            </div>

            {/* Row 5: Long Description */}
            <div className="space-y-1.5">
              <label
                className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Curatorial Narrative <span className="text-[#C0392B]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="In-depth design philosophy and craft story displayed on collection showcase..."
                {...register('long_description')}
                disabled={isSubmitting}
                className="w-full p-3 text-[12px] rounded-[4px] border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              {errors.long_description && (
                <p className="text-[10.5px] text-[#C0392B]">{errors.long_description.message}</p>
              )}
            </div>

            {/* Row 6: Cover Image Uploader */}
            <SingleImageUploader
              currentImageUrl={initialData?.image}
              onImageSelected={handleImageSelected}
              error={errors.image?.message}
              label="Collection Editorial Image"
              disabled={isSubmitting}
            />
          </div>

          {/* Fixed Footer Buttons */}
          <div className="p-4 sm:px-6 bg-[#FAF9F5] border-t border-[#E4E1DA] flex items-center justify-end gap-3.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[38px] px-5 bg-[#FFFFFF] border border-[#111111] text-[#111111] hover:bg-[#EAE7E0] hover:text-[#111111] text-[11px] font-semibold uppercase tracking-[0.06em] rounded-[6px] transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 h-[38px] px-6 bg-[#FFFFFF] hover:bg-[#EAE7E0] hover:text-[#111111] border border-[#111111] text-[#111111] text-[11px] font-semibold uppercase tracking-[0.06em] rounded-[6px] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span>{isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Collection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
