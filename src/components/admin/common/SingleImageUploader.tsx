'use client';

import React, { useState, useRef } from 'react';
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#55514E]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {label}
          {required && <span className="text-[#C0392B]"> *</span>}
        </label>
        <span
          className="text-[10px] text-[#99958D]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {aspectRatioHint}
        </span>
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
          className={`relative group rounded-[4px] overflow-hidden border border-[#E4E1DA] bg-[#F7F6F2] flex items-center justify-center ${aspectRatioClass} w-full max-h-[240px]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0D0D0D]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3.5 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="px-4 py-2 bg-[#FFFFFF] text-[#111111] hover:bg-[#F7F6F2] text-[10.5px] font-semibold uppercase tracking-[0.06em] rounded-[6px] border border-[#111111] shadow-sm transition-colors cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="px-3 py-2 bg-[#C0392B] text-white hover:bg-[#A93226] text-[10.5px] font-semibold uppercase tracking-[0.06em] rounded-[6px] shadow-sm transition-colors cursor-pointer"
              title="Remove image"
            >
              Remove
            </button>
          </div>
          {selectedFile && (
            <div
              className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#0D0D0D]/80 text-[#FFFFFF] text-[9.5px] font-mono rounded-[3px]"
            >
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; WebP Optimized
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border border-dashed rounded-[6px] p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${aspectRatioClass} w-full max-h-[220px] ${
            isDragging
              ? 'border-[#111111] bg-[#F3F0E9]'
              : 'border-[#DCD8D0] hover:border-[#111111] bg-[#F7F6F2] hover:bg-[#FFFFFF]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div>
            <p
              className="text-[12px] font-semibold text-[#111111] uppercase tracking-[0.05em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Click to upload or drag & drop
            </p>
            <p
              className="text-[10px] text-[#99958D] mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              JPEG, PNG, WebP, or AVIF (max 10MB)
            </p>
          </div>
        </div>
      )}

      {displayError && (
        <p
          className="text-[10.5px] text-[#C0392B] font-normal pt-0.5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {displayError}
        </p>
      )}
    </div>
  );
}
