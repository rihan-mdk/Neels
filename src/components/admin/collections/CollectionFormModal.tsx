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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFDFC] border border-[#E5DFD7] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#181515]">
              {isEditing ? `Edit Collection: ${initialData.name}` : 'Create New Collection'}
            </h2>
            <p className="text-xs text-[#8E867E] mt-0.5">
              Configure seasonal couture story, curatorial notes, and editorial imagery
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-[#8E867E] hover:text-[#181515] hover:bg-[#F7F5F0] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3 bg-[#C0392B]/10 border border-[#C0392B]/20 rounded-xl text-xs text-[#C0392B] flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Row 1: Name & Short Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
                Collection Title <span className="text-[#C0392B]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. The Heritage Edit"
                {...register('name')}
                onChange={handleNameChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E]"
              />
              {errors.name && (
                <p className="text-[11px] text-[#C0392B]">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
                Short Name <span className="text-[#C0392B]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Heritage Edit"
                {...register('short_name')}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E]"
              />
              {errors.short_name && (
                <p className="text-[11px] text-[#C0392B]">{errors.short_name.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Slug & Season Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
                  Slug (Primary Key) <span className="text-[#C0392B]">*</span>
                </label>
                {autoSlug && (
                  <span className="text-[10px] text-[#B07D3E] font-medium">Auto-syncing</span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. the-heritage-edit"
                {...register('slug')}
                onChange={handleSlugManualChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E]"
              />
              {errors.slug && (
                <p className="text-[11px] text-[#C0392B]">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
                Season / Badge
              </label>
              <input
                type="text"
                placeholder="e.g. AW 2026, Perennial, Limited Edition"
                {...register('season')}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E]"
              />
              {/* Season quick chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SEASON_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setValue('season', preset, { shouldValidate: true })}
                    className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors ${
                      watchSeason === preset
                        ? 'bg-[#B07D3E] text-white border-[#B07D3E]'
                        : 'bg-[#F7F5F0] text-[#5A524D] border-[#E5DFD7] hover:border-[#B07D3E]/50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              {errors.season && (
                <p className="text-[11px] text-[#C0392B]">{errors.season.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Display Order */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
              Display Order
            </label>
            <input
              type="number"
              min={0}
              {...register('display_order', { valueAsNumber: true })}
              disabled={isSubmitting}
              className="w-32 px-3 py-2 text-xs font-mono rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E]"
            />
            {errors.display_order && (
              <p className="text-[11px] text-[#C0392B]">{errors.display_order.message}</p>
            )}
          </div>

          {/* Row 4: Summary Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
              Summary Description <span className="text-[#C0392B]">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Brief essence of the collection for cards and highlights..."
              {...register('description')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E] resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-[#C0392B]">{errors.description.message}</p>
            )}
          </div>

          {/* Row 5: Long Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A524D]">
              Curatorial Narrative <span className="text-[#C0392B]">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="In-depth design philosophy and craft story displayed on collection showcase..."
              {...register('long_description')}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5DFD7] bg-[#FFFDFC] text-[#181515] focus:outline-none focus:border-[#B07D3E]"
            />
            {errors.long_description && (
              <p className="text-[11px] text-[#C0392B]">{errors.long_description.message}</p>
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

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5DFD7]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#5A524D] hover:text-[#181515] bg-[#F7F5F0] hover:bg-[#E5DFD7] rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium uppercase tracking-wider text-[#FFFDFC] bg-[#181515] hover:bg-[#2A2421] rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Collection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
