'use client';

import React from 'react';
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
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F] w-14"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Image
            </th>
            <th
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Name & Slug
            </th>
            <th
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Category
            </th>
            <th
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Price
            </th>
            <th
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F] text-center w-20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Active
            </th>
            <th
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F] text-center w-20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Featured
            </th>
            <th
              className="py-3 px-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#68655F] text-right w-36"
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
                    className="font-medium text-[#171717] text-[12.5px] leading-snug max-w-56 line-clamp-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="font-mono text-[10px] text-[#99958D]"
                  >
                    {product.slug}
                  </p>
                  {product.collection_slug && (
                    <span
                      className="inline-block text-[9.5px] text-[#68655F] font-normal"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {product.collection_slug}
                    </span>
                  )}
                  {product.is_new && (
                    <span
                      className="inline-block ml-1 px-1.5 py-0.2 bg-[#F3F0E9] text-[#68655F] text-[9px] font-medium uppercase tracking-[0.08em] border border-[#E7E4DD] rounded-[2px]"
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
                  className="inline-block px-2 py-0.5 bg-[#F3F0E9] text-[#68655F] text-[9.5px] font-medium uppercase tracking-[0.08em] border border-[#E7E4DD] rounded-[2px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {product.category_slug}
                </span>
              </td>

              {/* Price */}
              <td className="py-3.5 px-4">
                <span
                  className={`text-[12.5px] font-medium ${
                    product.price === null ? 'text-[#99958D] italic font-normal' : 'text-[#171717]'
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
                  className={`inline-flex items-center justify-center px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wider rounded-[3px] border transition-colors ${
                    product.is_active
                      ? 'bg-[#F0F7F3] border-[#C3E6D3] text-[#2D6A4F]'
                      : 'bg-[#F7F6F2] border-[#E7E4DD] text-[#99958D]'
                  }`}
                  title={product.is_active ? 'Published – click to draft' : 'Draft – click to publish'}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {product.is_active ? 'Live' : 'Draft'}
                </button>
              </td>

              {/* Featured Toggle */}
              <td className="py-3.5 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleFeatured(product.id, product.is_featured)}
                  className={`inline-flex items-center justify-center px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wider rounded-[3px] border transition-colors ${
                    product.is_featured
                      ? 'bg-[#111111] border-[#111111] text-[#FFFFFF]'
                      : 'bg-[#FFFFFF] border-[#E4E1DA] text-[#99958D]'
                  }`}
                  title={product.is_featured ? 'Featured – click to unfeature' : 'Not featured'}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {product.is_featured ? 'Yes' : 'No'}
                </button>
              </td>

              {/* Action Buttons */}
              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex items-center gap-3.5 justify-end">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="text-[11.5px] font-semibold text-[#171717] hover:underline uppercase tracking-[0.06em]"
                    title="Edit Product"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Edit
                  </button>
                  <span className="text-[#E4E1DA]">&bull;</span>
                  <button
                    type="button"
                    onClick={() => onClone(product)}
                    className="text-[11.5px] font-semibold text-[#68655F] hover:text-[#171717] uppercase tracking-[0.06em]"
                    title="Clone Product"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Clone
                  </button>
                  <span className="text-[#E4E1DA]">&bull;</span>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="text-[11.5px] font-semibold text-[#A93226] hover:underline uppercase tracking-[0.06em]"
                    title="Delete Product"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Delete
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
