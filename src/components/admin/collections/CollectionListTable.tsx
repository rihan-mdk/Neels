'use client';

import React from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
import { CollectionRecord } from '@/lib/validations/collection.schema';

interface CollectionListTableProps {
  collections: CollectionRecord[];
  onEdit: (collection: CollectionRecord) => void;
  onDelete: (collection: CollectionRecord) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isReordering?: boolean;
}

export default function CollectionListTable({
  collections,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isReordering = false,
}: CollectionListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#F7F5F0] text-[#8E867E] uppercase tracking-wider text-[10px] border-b border-[#E5DFD7]">
          <tr>
            <th className="py-3.5 px-4 w-12 text-center">Order</th>
            <th className="py-3.5 px-4 w-20">Image</th>
            <th className="py-3.5 px-4">Title & Short Name</th>
            <th className="py-3.5 px-4">Slug & Season</th>
            <th className="py-3.5 px-4 hidden md:table-cell">Narrative</th>
            <th className="py-3.5 px-4 text-right w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5DFD7]">
          {collections.map((col, idx) => (
            <tr
              key={col.slug}
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
                    {col.display_order}
                  </span>
                  <button
                    type="button"
                    onClick={() => onMoveDown(idx)}
                    disabled={idx === collections.length - 1 || isReordering}
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
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </td>

              {/* Title & Short Name */}
              <td className="py-3.5 px-4">
                <div className="space-y-0.5">
                  <p className="font-medium text-[#181515] text-sm flex items-center gap-1.5">
                    <span>{col.name}</span>
                  </p>
                  <p className="text-[11px] text-[#8E867E]">
                    Short: <span className="text-[#5A524D]">{col.short_name}</span>
                  </p>
                </div>
              </td>

              {/* Slug & Season Badge */}
              <td className="py-3.5 px-4">
                <div className="space-y-1">
                  <span className="inline-block font-mono text-[11px] px-2 py-0.5 bg-[#181515]/5 text-[#181515] rounded">
                    {col.slug}
                  </span>
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B07D3E]/10 text-[#B07D3E]">
                      <Sparkles size={10} />
                      <span>{col.season || 'Perennial'}</span>
                    </span>
                  </div>
                </div>
              </td>

              {/* Description Preview */}
              <td className="py-3.5 px-4 hidden md:table-cell text-[#5A524D] max-w-xs">
                <p className="line-clamp-2 text-xs leading-relaxed">
                  {col.description}
                </p>
              </td>

              {/* Action Buttons */}
              <td className="py-3.5 px-4 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(col)}
                    className="p-1.5 text-[#5A524D] hover:text-[#181515] hover:bg-[#F7F5F0] rounded-lg transition-colors"
                    title="Edit Collection"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(col)}
                    className="p-1.5 text-[#C0392B] hover:bg-[#C0392B]/10 rounded-lg transition-colors"
                    title="Delete Collection"
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
