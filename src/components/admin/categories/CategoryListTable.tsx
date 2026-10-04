'use client';

import React from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
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
      <table className="w-full text-left text-xs">
        <thead className="bg-[#F7F5F0] text-[#8E867E] uppercase tracking-wider text-[10px] border-b border-[#E5DFD7]">
          <tr>
            <th className="py-3.5 px-4 w-12 text-center">Order</th>
            <th className="py-3.5 px-4 w-20">Image</th>
            <th className="py-3.5 px-4">Name & Plural</th>
            <th className="py-3.5 px-4">Slug & Path</th>
            <th className="py-3.5 px-4 hidden md:table-cell">Description</th>
            <th className="py-3.5 px-4 text-right w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5DFD7]">
          {categories.map((category, idx) => (
            <tr
              key={category.slug}
              className="hover:bg-[#FBF9F5] transition-colors group"
            >
              {/* Display Order with Up/Down Controls */}
              <td className="py-3.5 px-4 text-center">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onMoveUp(idx)}
                    disabled={idx === 0 || isReordering}
                    className="p-0.5 text-[#8E867E] hover:text-[#181515] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <span className="font-mono text-[11px] text-[#5A524D] font-medium">
                    {category.display_order}
                  </span>
                  <button
                    type="button"
                    onClick={() => onMoveDown(idx)}
                    disabled={idx === categories.length - 1 || isReordering}
                    className="p-0.5 text-[#8E867E] hover:text-[#181515] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </td>

              {/* Cover Thumbnail */}
              <td className="py-3.5 px-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E5DFD7] bg-[#F7F5F0] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </td>

              {/* Name & Plural */}
              <td className="py-3.5 px-4">
                <div className="space-y-0.5">
                  <p className="font-medium text-[#181515] text-sm">{category.name}</p>
                  <p className="text-[11px] text-[#8E867E]">
                    Plural: <span className="text-[#5A524D]">{category.plural_name}</span>
                  </p>
                </div>
              </td>

              {/* Slug & Path */}
              <td className="py-3.5 px-4 font-mono text-[11px]">
                <div className="space-y-0.5">
                  <span className="inline-block px-2 py-0.5 bg-[#181515]/5 text-[#181515] rounded">
                    {category.slug}
                  </span>
                  <div className="flex items-center gap-1 text-[#8E867E]">
                    <span>{category.path}</span>
                    <a
                      href={category.path}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#B07D3E] transition-colors"
                      title="View on storefront"
                    >
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </td>

              {/* Description Preview */}
              <td className="py-3.5 px-4 hidden md:table-cell text-[#5A524D] max-w-xs">
                <p className="line-clamp-2 text-xs leading-relaxed">
                  {category.description}
                </p>
              </td>

              {/* Action Buttons */}
              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="p-1.5 text-[#5A524D] hover:text-[#181515] hover:bg-[#F7F5F0] rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    className="p-1.5 text-[#C0392B] hover:bg-[#C0392B]/10 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={15} />
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
