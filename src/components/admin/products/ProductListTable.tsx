'use client';

import React from 'react';
import { Edit2, Trash2, Copy, Star, StarOff, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { ProductRecord } from '@/lib/validations/product.schema';

interface ProductListTableProps {
  products: ProductRecord[];
  onEdit: (product: ProductRecord) => void;
  onDelete: (product: ProductRecord) => void;
  onClone: (product: ProductRecord) => void;
  onToggleActive: (id: string, current: boolean) => Promise<void>;
  onToggleFeatured: (id: string, current: boolean) => Promise<void>;
}

export default function ProductListTable({
  products,
  onEdit,
  onDelete,
  onClone,
  onToggleActive,
  onToggleFeatured,
}: ProductListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[860px]">
        <thead className="bg-[#F7F6F2] border-b border-[#E7E4DD]">
          <tr>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891] w-14"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Image
            </th>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Name & Slug
            </th>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Category
            </th>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Price
            </th>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891] text-center w-20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Active
            </th>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891] text-center w-20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Featured
            </th>
            <th
              className="py-3 px-4 text-[9px] font-normal uppercase tracking-[0.16em] text-[#9B9891] text-right w-28"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEECE7]">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-[#F7F6F2] transition-colors duration-100 group">
              {/* Thumbnail */}
              <td className="py-3.5 px-4">
                <div className="w-11 h-14 overflow-hidden border border-[#E7E4DD] bg-[#F7F6F2] flex-shrink-0 rounded-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_primary}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </td>

              {/* Name & Slug */}
              <td className="py-3.5 px-4">
                <div className="space-y-0.5">
                  <p
                    className="font-normal text-[#171717] text-[12px] leading-snug max-w-56 line-clamp-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="font-mono text-[10px] text-[#9B9891]"
                  >
                    {product.slug}
                  </p>
                  {product.collection_slug && (
                    <span
                      className="inline-flex items-center gap-1 text-[9px] text-[#6F6D68] font-normal"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Sparkles size={9} strokeWidth={1.4} />
                      <span>{product.collection_slug}</span>
                    </span>
                  )}
                  {product.is_new && (
                    <span
                      className="inline-block px-1.5 py-0.5 bg-[#F3F0E9] text-[#6F6D68] text-[9px] font-normal uppercase tracking-[0.08em] border border-[#E7E4DD] rounded-[2px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      New
                    </span>
                  )}
                </div>
              </td>

              {/* Category */}
              <td className="py-3.5 px-4">
                <span
                  className="inline-block px-2 py-0.5 bg-[#F3F0E9] text-[#6F6D68] text-[9px] font-normal uppercase tracking-[0.1em] border border-[#E7E4DD] rounded-[2px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {product.category_slug}
                </span>
              </td>

              {/* Price */}
              <td className="py-3.5 px-4">
                <span
                  className={`text-[12px] font-normal ${
                    product.price === null ? 'text-[#9B9891] italic' : 'text-[#171717]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {product.price_formatted}
                </span>
              </td>

              {/* Active Toggle */}
              <td className="py-3.5 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleActive(product.id, product.is_active)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[3px] transition-colors duration-150 hover:bg-[#EEECE7]"
                  title={product.is_active ? 'Published – click to draft' : 'Draft – click to publish'}
                >
                  {product.is_active ? (
                    <CheckCircle size={15} strokeWidth={1.5} className="text-[#2D6A4F]" />
                  ) : (
                    <XCircle size={15} strokeWidth={1.5} className="text-[#9B9891]" />
                  )}
                </button>
              </td>

              {/* Featured Toggle */}
              <td className="py-3.5 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleFeatured(product.id, product.is_featured)}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-[3px] transition-colors duration-150 hover:bg-[#EEECE7]"
                  title={product.is_featured ? 'Featured – click to unfeature' : 'Not featured'}
                >
                  {product.is_featured ? (
                    <Star size={14} strokeWidth={1.5} className="text-[#6F6D68] fill-[#6F6D68]" />
                  ) : (
                    <StarOff size={14} strokeWidth={1.5} className="text-[#C5C2BB]" />
                  )}
                </button>
              </td>

              {/* Action Buttons */}
              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="p-1.5 text-[#6F6D68] hover:text-[#171717] hover:bg-[#EEECE7] rounded-[3px] transition-colors duration-150"
                    title="Edit Product"
                  >
                    <Edit2 size={13} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onClone(product)}
                    className="p-1.5 text-[#6F6D68] hover:text-[#171717] hover:bg-[#EEECE7] rounded-[3px] transition-colors duration-150"
                    title="Clone Product"
                  >
                    <Copy size={13} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="p-1.5 text-[#9B9891] hover:text-[#C0392B] hover:bg-[#C0392B]/8 rounded-[3px] transition-colors duration-150"
                    title="Delete Product"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
