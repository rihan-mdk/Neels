'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  // Build page number windows
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#E4E1DA] bg-[#FFFFFF]">
      <p
        className="text-[11px] text-[#99958D] font-normal"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Showing <span className="text-[#171717] font-medium">{from}–{to}</span> of{' '}
        <span className="text-[#171717] font-medium">{totalCount}</span> products
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-7 h-7 flex items-center justify-center text-[#99958D] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[4px] border border-transparent hover:border-[#E4E1DA] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>

        {getPages().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 text-[11px] text-[#99958D]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={`w-7 h-7 text-[11px] font-medium rounded-[4px] flex items-center justify-center transition-colors duration-150 ${
                p === page
                  ? 'bg-[#111111] text-[#FFFFFF]'
                  : 'text-[#68655F] hover:bg-[#F7F6F2] hover:text-[#171717]'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-7 h-7 flex items-center justify-center text-[#99958D] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[4px] border border-transparent hover:border-[#E4E1DA] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-transparent"
          aria-label="Next page"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
