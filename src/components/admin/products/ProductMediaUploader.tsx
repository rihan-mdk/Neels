'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { validateImageFile } from '@/lib/services/storage.service';
import SingleImageUploader from '@/components/admin/common/SingleImageUploader';

interface GalleryItem {
  id: string;
  url?: string;
  file?: File;
}

interface ProductMediaUploaderProps {
  initialPrimaryUrl?: string;
  initialHoverUrl?: string;
  initialGalleryUrls?: string[];
  onPrimarySelected: (file: File | null) => void;
  onHoverSelected: (file: File | null) => void;
  onGalleryChanged: (files: File[], existingUrls: string[], removedUrls: string[]) => void;
  primaryError?: string;
  disabled?: boolean;
}

export default function ProductMediaUploader({
  initialPrimaryUrl,
  initialHoverUrl,
  initialGalleryUrls = [],
  onPrimarySelected,
  onHoverSelected,
  onGalleryChanged,
  primaryError,
  disabled = false,
}: ProductMediaUploaderProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    initialGalleryUrls.map((url, i) => ({
      id: `existing-${i}-${url}`,
      url,
    }))
  );
  const [removedGalleryUrls, setRemovedGalleryUrls] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const notifyGalleryChange = (
    currentItems: GalleryItem[],
    removed: string[]
  ) => {
    const files = currentItems.filter((item) => item.file).map((item) => item.file as File);
    const existing = currentItems.filter((item) => item.url).map((item) => item.url as string);
    onGalleryChanged(files, existing, removed);
  };

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles: GalleryItem[] = [];
    Array.from(e.target.files).forEach((file, index) => {
      const valid = validateImageFile(file);
      if (valid.valid) {
        newFiles.push({
          id: `new-${Date.now()}-${index}-${file.name}`,
          file,
        });
      }
    });

    const updated = [...galleryItems, ...newFiles];
    setGalleryItems(updated);
    notifyGalleryChange(updated, removedGalleryUrls);

    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    const item = galleryItems[index];
    const updated = galleryItems.filter((_, i) => i !== index);
    let updatedRemoved = [...removedGalleryUrls];

    if (item.url) {
      updatedRemoved.push(item.url);
      setRemovedGalleryUrls(updatedRemoved);
    }

    setGalleryItems(updated);
    notifyGalleryChange(updated, updatedRemoved);
  };

  const handleMoveGalleryItem = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryItems.length) return;

    const updated = [...galleryItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setGalleryItems(updated);
    notifyGalleryChange(updated, removedGalleryUrls);
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Editorial Cards for Primary Cover & Hover Look */}
      <div className="p-6 bg-[#FFFFFF] border border-[#E8E4DC] rounded-xl shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Cover Image — required */}
          <SingleImageUploader
            label="PRIMARY COVER IMAGE"
            aspectRatioHint="Main catalog & card view (3:4 portrait recommended)"
            currentImageUrl={initialPrimaryUrl}
            onImageSelected={onPrimarySelected}
            error={primaryError}
            disabled={disabled}
            required={true}
            aspectRatioClass="aspect-[3/4]"
          />

          {/* Hover Editorial Image — optional, no asterisk */}
          <SingleImageUploader
            label="HOVER LOOK IMAGE (OPTIONAL)"
            aspectRatioHint="Secondary look shown on card hover"
            currentImageUrl={initialHoverUrl}
            onImageSelected={onHoverSelected}
            disabled={disabled}
            required={false}
            aspectRatioClass="aspect-[3/4]"
          />
        </div>
      </div>

      {/* Section 2: Product Gallery Media Management */}
      <div className="p-6 bg-[#FFFFFF] border border-[#E8E4DC] rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E8E4DC]">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#101010]">
              PRODUCT GALLERY IMAGES
            </h3>
            <p className="text-[11px] text-[#7A736A] mt-0.5">
              Order in the list below determines display sequence on product showcase
            </p>
          </div>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#101010] hover:bg-[#262422] text-[#FFFFFF] text-xs font-medium uppercase tracking-[0.1em] rounded-md transition-colors shadow-xs disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>+ ADD GALLERY IMAGES</span>
          </button>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleGalleryFiles}
          className="hidden"
          disabled={disabled}
        />

        {galleryItems.length === 0 ? (
          <div
            onClick={() => !disabled && galleryInputRef.current?.click()}
            className="border border-dashed border-[#D5CFBF] hover:border-[#9E7A44] bg-[#FAF8F5] rounded-lg py-12 px-6 text-center cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E8E4DC] text-[#7A736A] group-hover:text-[#9E7A44] group-hover:border-[#9E7A44]/40 flex items-center justify-center mx-auto mb-3 transition-colors shadow-xs">
              <Upload size={20} />
            </div>
            <p className="text-xs font-medium text-[#101010]">Click to upload gallery photos</p>
            <p className="text-[11px] text-[#7A736A] mt-1 max-w-sm mx-auto">
              Upload multiple close-ups, embroidery details, or runway views
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {galleryItems.map((item, idx) => {
              const src = item.url || (item.file ? URL.createObjectURL(item.file) : '');
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-3 hover:border-[#D5CFBF] transition-all"
                >
                  {/* Position badge */}
                  <div className="w-8 h-8 rounded bg-[#FFFFFF] border border-[#E8E4DC] flex items-center justify-center font-mono text-xs font-semibold text-[#5A524D] shrink-0">
                    #{idx + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-[#E8E4DC] bg-[#FFFFFF] shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#101010] font-medium truncate">
                      {item.file ? item.file.name : item.url?.split('/').pop() || 'Saved showcase image'}
                    </p>
                    <p className="text-[11px] text-[#9E7A44] uppercase tracking-wider font-mono mt-0.5">
                      {item.file ? 'New image — will convert to WebP on save' : 'Persisted in gallery'}
                    </p>
                  </div>

                  {/* Reorder & Remove Controls — always visible */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveGalleryItem(idx, 'left')}
                      disabled={idx === 0 || disabled}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E8E4DC] text-xs font-medium text-[#5A524D] hover:text-[#101010] hover:bg-[#F4F1EB] rounded transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move earlier in sequence"
                    >
                      <ChevronLeft size={13} />
                      <span className="hidden sm:inline">Move Earlier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveGalleryItem(idx, 'right')}
                      disabled={idx === galleryItems.length - 1 || disabled}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E8E4DC] text-xs font-medium text-[#5A524D] hover:text-[#101010] hover:bg-[#F4F1EB] rounded transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move later in sequence"
                    >
                      <span className="hidden sm:inline">Move Later</span>
                      <ChevronRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(idx)}
                      disabled={disabled}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFFFF] border border-[#E8E4DC] hover:border-[#E5A8A4] text-xs font-medium text-[#C0392B] hover:bg-[#FBEBEA] rounded transition-colors disabled:opacity-50"
                      title="Remove from gallery"
                    >
                      <X size={13} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
