'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  warningText?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  warningText,
  isLoading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFDFC] border border-[#E5DFD7] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#C0392B]/10 text-[#C0392B] flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-semibold text-[#181515]">
              {title}
            </h3>
            <p className="text-xs text-[#5A524D] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {warningText && (
          <div className="p-3 bg-[#FBF9F5] border border-[#E5DFD7] rounded-xl text-[11px] text-[#8E867E] leading-normal">
            <strong className="text-[#181515] font-semibold">Note: </strong>
            {warningText}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-medium text-[#5A524D] hover:text-[#181515] bg-[#F7F5F0] hover:bg-[#E5DFD7] rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#C0392B] hover:bg-[#A93226] rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            <span>Delete Forever</span>
          </button>
        </div>
      </div>
    </div>
  );
}
