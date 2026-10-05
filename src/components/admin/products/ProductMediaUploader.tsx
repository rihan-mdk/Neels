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
    <div className="space-y-5">
      {/* Section 1: Editorial Cards for Primary Cover & Hover Look */}
      <div className="p-5 bg-[#FFFFFF] border border-[#E4E1DA] rounded-[4px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Primary Cover Image — required */}
          <SingleImageUploader
            label="Primary Cover Image"
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
            label="Hover Look Image (Optional)"
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
      <div className="p-5 bg-[#FFFFFF] border border-[#E4E1DA] rounded-[4px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E1DA]">
          <div>
            <h3
              className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Product Gallery Images
            </h3>
            <p
              className="text-[11px] text-[#99958D] mt-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Order in the list below determines display sequence on product showcase
            </p>
          </div>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-1.5 h-[36px] px-4 bg-[#111111] hover:bg-[#252525] border border-[#111111] text-[#FFFFFF] text-[10.5px] font-semibold uppercase tracking-[0.05em] rounded-[4px] transition-colors shadow-sm disabled:opacity-50 shrink-0 self-start sm:self-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Plus size={13} strokeWidth={2} />
            <span>Add Gallery Images</span>
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
            className="border border-dashed border-[#DCD8D0] hover:border-[#171717] bg-[#F7F6F2] hover:bg-[#FFFFFF] rounded-[4px] py-10 px-6 text-center cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-[3px] bg-[#FFFFFF] border border-[#E4E1DA] text-[#68655F] group-hover:text-[#171717] flex items-center justify-center mx-auto mb-2.5 transition-colors shadow-xs">
              <Upload size={17} strokeWidth={1.5} />
            </div>
            <p
              className="text-[12px] font-medium text-[#171717]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Click to upload gallery photos
            </p>
            <p
              className="text-[10.5px] text-[#99958D] mt-0.5 max-w-sm mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Upload multiple close-ups, embroidery details, or runway views
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {galleryItems.map((item, idx) => {
              const src = item.url || (item.file ? URL.createObjectURL(item.file) : '');
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 bg-[#F7F6F2] border border-[#E4E1DA] rounded-[3px] p-2.5 hover:border-[#171717]/25 transition-all"
                >
                  {/* Position badge */}
                  <div className="w-7 h-7 rounded-[2px] bg-[#FFFFFF] border border-[#E4E1DA] flex items-center justify-center font-mono text-[11px] font-semibold text-[#68655F] shrink-0">
                    #{idx + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-[2px] overflow-hidden border border-[#E4E1DA] bg-[#FFFFFF] shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] text-[#171717] font-medium truncate"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.file ? item.file.name : item.url?.split('/').pop() || 'Saved showcase image'}
                    </p>
                    <p
                      className="text-[10px] text-[#99958D] uppercase tracking-wider font-mono mt-0.5"
                    >
                      {item.file ? 'New image — converts to WebP on save' : 'Persisted in gallery'}
                    </p>
                  </div>

                  {/* Reorder & Remove Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveGalleryItem(idx, 'left')}
                      disabled={idx === 0 || disabled}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFFFF] border border-[#DCD8D0] text-[11px] font-medium text-[#68655F] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[3px] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move earlier in sequence"
                    >
                      <ChevronLeft size={12} strokeWidth={1.5} />
                      <span className="hidden sm:inline">Earlier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveGalleryItem(idx, 'right')}
                      disabled={idx === galleryItems.length - 1 || disabled}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFFFF] border border-[#DCD8D0] text-[11px] font-medium text-[#68655F] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[3px] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move later in sequence"
                    >
                      <span className="hidden sm:inline">Later</span>
                      <ChevronRight size={12} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(idx)}
                      disabled={disabled}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FFFFFF] border border-[#DCD8D0] text-[11px] font-medium text-[#C0392B] hover:bg-[#C0392B]/10 rounded-[3px] transition-colors disabled:opacity-50"
                      title="Remove from gallery"
                    >
                      <X size={12} strokeWidth={1.5} />
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
