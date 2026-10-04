'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ProductDetailsEditorProps {
  details: string[];
  onChange: (details: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function ProductDetailsEditor({
  details,
  onChange,
  error,
  disabled = false,
}: ProductDetailsEditorProps) {
  const [newDetailInput, setNewDetailInput] = useState('');

  const handleAdd = () => {
    if (!newDetailInput.trim()) return;
    const updated = [...details, newDetailInput.trim()];
    onChange(updated);
    setNewDetailInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleUpdate = (index: number, value: string) => {
    const updated = [...details];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = details.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="p-6 bg-[#FFFFFF] border border-[#E8E4DC] rounded-xl shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#101010]">
            CRAFTSMANSHIP DETAILS & SPECIFICATIONS <span className="text-[#C0392B]">*</span>
          </label>
          <p className="text-[11px] text-[#7A736A] mt-0.5">
            Key garment specifications, embroidery methods, and artisan notes
          </p>
        </div>
        <span className="text-xs font-mono text-[#7A736A] shrink-0 bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E8E4DC]">
          {details.length} {details.length === 1 ? 'bullet' : 'bullets'}
        </span>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2.5">
        <input
          type="text"
          value={newDetailInput}
          onChange={(e) => setNewDetailInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Hand-embroidered zardozi work on georgette base..."
          disabled={disabled}
          className="flex-1 px-3.5 py-2.5 text-xs rounded-md border border-[#E8E4DC] bg-[#FAF8F5] text-[#101010] placeholder-[#9E978E] focus:outline-none focus:border-[#9E7A44] focus:bg-[#FFFFFF] transition-all"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newDetailInput.trim() || disabled}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#101010] text-[#FFFFFF] hover:bg-[#262422] text-xs font-medium uppercase tracking-[0.1em] rounded-md transition-colors disabled:opacity-40 shrink-0"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      {/* Existing details list */}
      {details.length > 0 && (
        <div className="space-y-2 pt-1">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-[#FAF8F5] border border-[#E8E4DC] rounded-md px-3.5 py-2 hover:border-[#D5CFBF] transition-colors"
            >
              <div className="w-6 text-center font-mono text-xs font-semibold text-[#7A736A] shrink-0">
                {idx + 1}.
              </div>
              <input
                type="text"
                value={detail}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                disabled={disabled}
                className="flex-1 bg-transparent text-xs text-[#101010] focus:outline-none border-b border-transparent focus:border-[#9E7A44] py-0.5"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                disabled={disabled}
                className="p-1.5 text-[#7A736A] hover:text-[#C0392B] hover:bg-[#FBEBEA] rounded transition-colors shrink-0"
                title="Remove bullet"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-[11px] text-[#C0392B] font-medium pt-1">{error}</p>}
    </div>
  );
}
