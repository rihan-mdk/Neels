'use client';

import React from 'react';
import { ProductQueryOptions } from '@/lib/validations/product.schema';

interface CategoryOption { slug: string; name: string; }
interface CollectionOption { slug: string; name: string; }

interface ProductFilterToolbarProps {
  filters: ProductQueryOptions;
  onFiltersChange: (next: Partial<ProductQueryOptions>) => void;
  categories: CategoryOption[];
  collections: CollectionOption[];
  totalCount: number;
}

const inputBase = [
  'border border-[#E2DED6] bg-[#FFFFFF] text-[#202020] placeholder-[#9A968E]',
  'focus:outline-none focus:border-[#55514B]',
  'transition-colors duration-150 rounded-[4px]',
  'text-[12px]',
  'h-[38px]',
].join(' ');

export default function ProductFilterToolbar({
  filters,
  onFiltersChange,
  categories,
  collections,
  totalCount,
}: ProductFilterToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Search + dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-56">
          <input
            type="text"
            placeholder="Search silhouettes, fabrics, names..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value, page: 1 })}
            className={`${inputBase} w-full px-3.5`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {/* Category dropdown */}
        <div className="relative w-[160px]">
          <select
            value={filters.categorySlug || 'all'}
            onChange={(e) => onFiltersChange({ categorySlug: e.target.value, page: 1 })}
            className={`${inputBase} w-full px-3 cursor-pointer`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Collection dropdown */}
        <div className="relative w-[160px]">
          <select
            value={filters.collectionSlug || 'all'}
            onChange={(e) => onFiltersChange({ collectionSlug: e.target.value, page: 1 })}
            className={`${inputBase} w-full px-3 cursor-pointer`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <option value="all">All Collections</option>
            <option value="none">No Collection</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Total count */}
        <div
          className="ml-auto text-[11px] text-[#99958D] whitespace-nowrap font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {totalCount} {totalCount === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* Row 2: Status / Merchandising tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {/* All / Active / Draft tabs */}
        {(['all', 'active', 'draft'] as const).map((status) => {
          const isActive = (filters.status || 'all') === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onFiltersChange({ status, page: 1 })}
              className={`h-[34px] px-4 text-[11px] tracking-[0.06em] uppercase border transition-colors duration-150 rounded-[6px] font-semibold ${
                isActive
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#FFFFFF] text-[#68655F] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {status}
            </button>
          );
        })}

        {/* Featured chip */}
        <button
          type="button"
          onClick={() => onFiltersChange({ featuredOnly: !filters.featuredOnly, page: 1 })}
          className={`h-[34px] px-4 text-[11px] tracking-[0.06em] uppercase border transition-colors duration-150 rounded-[6px] font-semibold ${
            filters.featuredOnly
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-[#FFFFFF] text-[#68655F] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Featured
        </button>

        {/* New Arrivals chip */}
        <button
          type="button"
          onClick={() => onFiltersChange({ newOnly: !filters.newOnly, page: 1 })}
          className={`h-[34px] px-4 text-[11px] tracking-[0.06em] uppercase border transition-colors duration-150 rounded-[6px] font-semibold ${
            filters.newOnly
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-[#FFFFFF] text-[#68655F] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          New Arrivals
        </button>
      </div>
    </div>
  );
}
