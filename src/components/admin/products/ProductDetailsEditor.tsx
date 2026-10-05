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
    <div className="p-4 bg-[#FFFFFF] border border-[#E4E1DA] rounded-[6px] space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#EEECE7]">
        <div>
          <label
            className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#55514E]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Craftsmanship Details & Specifications <span className="text-[#A93226]">*</span>
          </label>
          <p
            className="text-[11px] text-[#99958D] mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Key garment specifications, embroidery methods, and artisan notes
          </p>
        </div>
        <span
          className="text-[10.5px] font-mono text-[#68655F] shrink-0 bg-[#F7F6F2] px-2 py-0.5 rounded-[4px] border border-[#E4E1DA]"
        >
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
          className="flex-1 px-3.5 h-[38px] text-[12.5px] rounded-[6px] border border-[#E2DED6] bg-[#FFFFFF] text-[#171717] placeholder-[#9A968E] focus:outline-none focus:border-[#55514B] transition-all"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newDetailInput.trim() || disabled}
          className="inline-flex items-center justify-center h-[38px] px-4.5 bg-[#FFFFFF] hover:bg-[#111111] hover:text-[#FFFFFF] border border-[#111111] text-[#111111] text-[11px] font-semibold uppercase tracking-[0.06em] rounded-[6px] transition-colors disabled:opacity-40 shrink-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Add
        </button>
      </div>

      {/* Existing details list */}
      {details.length > 0 && (
        <div className="space-y-1.5 pt-0.5">
          {details.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 bg-[#F7F6F2] border border-[#E4E1DA] rounded-[4px] px-3 py-1.5 hover:border-[#171717]/25 transition-colors"
            >
              <div className="w-5 text-center font-mono text-[11px] font-medium text-[#99958D] shrink-0">
                {idx + 1}.
              </div>
              <input
                type="text"
                value={detail}
                onChange={(e) => handleUpdate(idx, e.target.value)}
                disabled={disabled}
                className="flex-1 bg-transparent text-[12px] text-[#171717] focus:outline-none border-b border-transparent focus:border-[#55514B] py-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                disabled={disabled}
                className="text-[12px] text-[#99958D] hover:text-[#A93226] px-1.5 py-0.5 rounded-[3px] transition-colors shrink-0 font-bold"
                title="Remove bullet"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p
          className="text-[11px] text-[#A93226] font-normal pt-0.5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
