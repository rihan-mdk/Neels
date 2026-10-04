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
    <div className="flex items-center justify-between px-5 py-3 border-t border-[#E7E4DD] bg-[#FFFFFF]">
      <p
        className="text-[10px] text-[#9B9891] font-normal"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Showing <span className="text-[#171717]">{from}–{to}</span> of{' '}
        <span className="text-[#171717]">{totalCount}</span> products
      </p>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 text-[#9B9891] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[3px] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>

        {getPages().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-[10px] text-[#9B9891]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={`w-6 h-6 text-[10px] font-normal rounded-[3px] transition-colors duration-150 ${
                p === page
                  ? 'bg-[#111111] text-white'
                  : 'text-[#6F6D68] hover:bg-[#F7F6F2]'
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
          className="p-1.5 text-[#9B9891] hover:text-[#171717] hover:bg-[#F7F6F2] rounded-[3px] transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
