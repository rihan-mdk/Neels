'use client';

import React from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0D0D]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[6px] max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="space-y-1">
          <h3
            className="text-[19px] font-normal text-[#111111] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h3>
          <p
            className="text-[11.5px] text-[#68655F] leading-relaxed font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {description}
          </p>
        </div>

        {warningText && (
          <div
            className="p-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-[6px] text-[11px] text-[#68655F] leading-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <strong className="text-[#111111] font-semibold">Note: </strong>
            {warningText}
          </div>
        )}

        <div className="flex items-center justify-end gap-3.5 pt-3 border-t border-[#E4E1DA]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-[36px] px-4 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#111111] hover:text-[#000000] bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#111111] rounded-[6px] transition-colors disabled:opacity-50 cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center h-[36px] px-4.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-white bg-[#C0392B] hover:bg-[#A93226] rounded-[6px] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>{isLoading ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
