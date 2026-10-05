'use client';

import React from 'react';
import { CategoryRecord } from '@/lib/validations/category.schema';

interface CategoryListTableProps {
  categories: CategoryRecord[];
  onEdit: (category: CategoryRecord) => void;
  onDelete: (category: CategoryRecord) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isReordering?: boolean;
}

export default function CategoryListTable({
  categories,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isReordering = false,
}: CategoryListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs min-w-[760px]">
        <thead className="bg-[#F7F6F2] text-[#68655F] uppercase tracking-[0.14em] text-[9.5px] font-semibold border-b border-[#E4E1DA]">
          <tr>
            <th className="py-3.5 px-5 w-[8%] text-center" style={{ fontFamily: "'Inter', sans-serif" }}>Order</th>
            <th className="py-3.5 px-5 w-[10%]" style={{ fontFamily: "'Inter', sans-serif" }}>Image</th>
            <th className="py-3.5 px-5 w-[22%]" style={{ fontFamily: "'Inter', sans-serif" }}>Name & Plural</th>
            <th className="py-3.5 px-5 w-[18%]" style={{ fontFamily: "'Inter', sans-serif" }}>Slug & Path</th>
            <th className="py-3.5 px-5 w-[30%] hidden md:table-cell" style={{ fontFamily: "'Inter', sans-serif" }}>Description</th>
            <th className="py-3.5 px-5 w-[12%] text-right" style={{ fontFamily: "'Inter', sans-serif" }}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEECE7]">
          {categories.map((category, idx) => (
            <tr
              key={category.slug}
              className="hover:bg-[#F7F6F2] transition-colors group"
            >
              {/* Display Order with Up/Down Controls */}
              <td className="py-4 px-5 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onMoveUp(idx)}
                    disabled={idx === 0 || isReordering}
                    className="text-[12px] text-[#99958D] hover:text-[#111111] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <span className="font-mono text-[12px] text-[#111111] font-medium px-1">
                    {category.display_order}
                  </span>
                  <button
                    type="button"
                    onClick={() => onMoveDown(idx)}
                    disabled={idx === categories.length - 1 || isReordering}
                    className="text-[12px] text-[#99958D] hover:text-[#111111] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    ↓
                  </button>
                </div>
              </td>

              {/* Cover Thumbnail */}
              <td className="py-4 px-5">
                <div className="w-13 h-13 rounded-[4px] overflow-hidden border border-[#E4E1DA] bg-[#F7F6F2] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </td>

              {/* Name & Plural */}
              <td className="py-4 px-5">
                <div className="space-y-1">
                  <p
                    className="font-semibold text-[#111111] text-[13px] leading-tight"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {category.name}
                  </p>
                  <p
                    className="text-[11px] text-[#78746D]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Plural: <span className="text-[#111111] font-medium">{category.plural_name}</span>
                  </p>
                </div>
              </td>

              {/* Slug & Path */}
              <td className="py-4 px-5">
                <div className="space-y-1.5">
                  <span className="inline-block px-2.5 py-0.5 bg-[#F3F0E9] border border-[#E4E1DA] text-[#111111] rounded-[4px] font-mono text-[11px]">
                    {category.slug}
                  </span>
                  <div>
                    <a
                      href={category.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#68655F] hover:text-[#111111] transition-colors text-[11px] font-mono"
                      title="View on storefront"
                    >
                      {category.path} ↗
                    </a>
                  </div>
                </div>
              </td>

              {/* Description Preview */}
              <td className="py-4 px-5 hidden md:table-cell text-[#55514E]">
                <p
                  className="line-clamp-2 text-[12px] leading-relaxed font-normal"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {category.description}
                </p>
              </td>

              {/* Action Buttons */}
              <td className="py-4 px-5 text-right">
                <div className="inline-flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="text-[11.5px] font-semibold text-[#111111] hover:underline uppercase tracking-[0.06em] cursor-pointer"
                    title="Edit Category"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Edit
                  </button>
                  <span className="text-[#DCD8D0]">&bull;</span>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="text-[11.5px] font-semibold text-[#C0392B] hover:text-[#A93226] hover:underline uppercase tracking-[0.06em] cursor-pointer"
                    title="Delete Category"
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
