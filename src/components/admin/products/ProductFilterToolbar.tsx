'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
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
  'border border-[#E4E1DA] bg-[#FFFFFF] text-[#202020] placeholder-[#99958D]',
  'focus:outline-none focus:border-[#171717]',
  'transition-colors duration-150 rounded-[3px]',
  'text-[11px]',
  'h-[36px]',
].join(' ');

export default function ProductFilterToolbar({
  filters,
  onFiltersChange,
  categories,
  collections,
  totalCount,
}: ProductFilterToolbarProps) {
  return (
    <div className="space-y-2.5">
      {/* Row 1: Search + dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={13} strokeWidth={1.4} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99958D]" />
          <input
            type="text"
            placeholder="Search by name, slug, or fabric..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value, page: 1 })}
            className={`${inputBase} w-full pl-8 pr-3`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={filters.categorySlug || 'all'}
            onChange={(e) => onFiltersChange({ categorySlug: e.target.value, page: 1 })}
            className={`${inputBase} pl-3 pr-8 appearance-none cursor-pointer`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={11} strokeWidth={1.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#99958D] pointer-events-none" />
        </div>

        {/* Collection dropdown */}
        <div className="relative">
          <select
            value={filters.collectionSlug || 'all'}
            onChange={(e) => onFiltersChange({ collectionSlug: e.target.value, page: 1 })}
            className={`${inputBase} pl-3 pr-8 appearance-none cursor-pointer`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <option value="all">All Collections</option>
            <option value="none">No Collection</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={11} strokeWidth={1.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#99958D] pointer-events-none" />
        </div>

        {/* Total count */}
        <div
          className="ml-auto text-[10px] text-[#9B9891] whitespace-nowrap font-normal tracking-wide"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {totalCount} {totalCount === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* Row 2: Status / Merchandising tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* All / Active / Draft tabs */}
        {(['all', 'active', 'draft'] as const).map((status) => {
          const isActive = (filters.status || 'all') === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => onFiltersChange({ status, page: 1 })}
              className={`h-[28px] px-3 text-[10px] tracking-[0.1em] uppercase border transition-colors duration-150 rounded-[3px] font-normal ${
                isActive
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#FFFFFF] text-[#6F6D68] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
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
          className={`h-[28px] px-3 text-[10px] tracking-[0.1em] uppercase border transition-colors duration-150 rounded-[3px] font-normal ${
            filters.featuredOnly
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-[#FFFFFF] text-[#6F6D68] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ★ Featured
        </button>

        {/* New Arrivals chip */}
        <button
          type="button"
          onClick={() => onFiltersChange({ newOnly: !filters.newOnly, page: 1 })}
          className={`h-[28px] px-3 text-[10px] tracking-[0.1em] uppercase border transition-colors duration-150 rounded-[3px] font-normal ${
            filters.newOnly
              ? 'bg-[#111111] text-white border-[#111111]'
              : 'bg-[#FFFFFF] text-[#6F6D68] border-[#E4E1DA] hover:border-[#171717] hover:text-[#171717]'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          New Arrivals
        </button>
      </div>
    </div>
  );
}
