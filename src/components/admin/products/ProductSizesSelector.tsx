'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { STANDARD_PRODUCT_SIZES } from '@/lib/validations/product.schema';

interface ProductSizesSelectorProps {
  selectedSizes: string[];
  onChange: (sizes: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function ProductSizesSelector({
  selectedSizes,
  onChange,
  error,
  disabled = false,
}: ProductSizesSelectorProps) {
  const toggleSize = (size: string) => {
    if (disabled) return;
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((s) => s !== size));
    } else {
      onChange([...selectedSizes, size]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onChange([...STANDARD_PRODUCT_SIZES]);
  };

  const handleClear = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="p-6 bg-[#FFFFFF] border border-[#E7E4DD] rounded-[4px] space-y-3.5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DD]">
        <div>
          <label
            className="block text-[10px] font-normal uppercase tracking-[0.14em] text-[#6F6D68]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            AVAILABLE SIZES <span className="text-[#C0392B]">*</span>
          </label>
          <p
            className="text-[10px] text-[#9B9891] mt-0.5 font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Select standard bridal and couture sizing options available for this piece
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled}
            className="text-[10px] uppercase tracking-wider text-[#6F6D68] hover:text-[#171717] font-normal transition-colors duration-150 disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Select All
          </button>
          <span className="text-[#D5CFBF]">&bull;</span>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-[10px] uppercase tracking-wider text-[#9B9891] hover:text-[#171717] font-normal transition-colors duration-150 disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {STANDARD_PRODUCT_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              disabled={disabled}
              className={`px-3.5 py-1.5 rounded-[3px] text-[11px] font-normal uppercase tracking-[0.1em] transition-all duration-150 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-[#F7F6F2] text-[#6F6D68] border-[#E7E4DD] hover:border-[#171717] hover:bg-[#FFFFFF]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isSelected && <Check size={12} strokeWidth={1.8} className="text-white" />}
              <span>{size}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-[10px] text-[#C0392B] font-normal pt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>}
    </div>
  );
}
