'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { validateImageFile } from '@/lib/services/storage.service';

interface SingleImageUploaderProps {
  currentImageUrl?: string;
  onImageSelected: (file: File | null) => void;
  error?: string;
  label?: string;
  aspectRatioHint?: string;
  disabled?: boolean;
  required?: boolean;
  aspectRatioClass?: string;
}

export default function SingleImageUploader({
  currentImageUrl,
  onImageSelected,
  error,
  label = 'Cover Image',
  aspectRatioHint = 'Recommended ratio: 3:4 portrait or 16:9 landscape (max 10MB)',
  disabled = false,
  required = true,
  aspectRatioClass = 'aspect-[3/4]',
}: SingleImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setLocalError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setLocalError(validation.error || 'Invalid image file.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    setLocalError(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#101010]">
          {label}
          {required && <span className="text-[#C0392B]"> *</span>}
        </label>
        <span className="text-[11px] text-[#7A736A]">{aspectRatioHint}</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {previewUrl ? (
        <div
          className={`relative group rounded-lg overflow-hidden border border-[#E8E4DC] bg-[#FAF8F5] shadow-xs flex items-center justify-center ${aspectRatioClass} w-full`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#101010]/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-3.5 py-1.5 bg-[#FFFFFF] text-[#101010] hover:bg-[#F4F1EB] text-xs font-medium uppercase tracking-[0.08em] rounded-md shadow-sm transition-colors"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1.5 bg-[#C0392B] text-white hover:bg-[#A93226] rounded-md shadow-sm transition-colors"
              title="Remove image"
            >
              <X size={15} />
            </button>
          </div>
          {selectedFile && (
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-[#101010]/85 text-[#FFFFFF] text-[10px] font-mono rounded backdrop-blur-xs">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Auto-optimized to WebP
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${aspectRatioClass} w-full ${
            isDragging
              ? 'border-[#9E7A44] bg-[#9E7A44]/5'
              : 'border-[#D5CFBF] hover:border-[#9E7A44] bg-[#FAF8F5] hover:bg-[#FFFFFF]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E8E4DC] text-[#7A736A] flex items-center justify-center shadow-xs">
            <Upload size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-[#101010]">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] text-[#7A736A] mt-0.5">
              JPEG, PNG, WebP, or AVIF
            </p>
          </div>
        </div>
      )}

      {displayError && (
        <p className="text-[11px] text-[#C0392B] font-medium pt-0.5">{displayError}</p>
      )}
    </div>
  );
}
