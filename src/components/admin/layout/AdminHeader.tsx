'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  adminEmail?: string;
}

export default function AdminHeader({ onToggleSidebar, adminEmail }: AdminHeaderProps) {
  return (
    <header
      className="h-[52px] bg-[#FFFFFF] border-b border-[#E7E4DD] px-6 md:px-8 flex items-center justify-between sticky top-0 z-30"
    >
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 text-[#6F6D68] hover:text-[#171717] hover:bg-[#F3F0E9] transition-colors duration-150 rounded-sm"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span
            className="text-[12px] font-light text-[#171717] tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}
          >
            NEEL'S STUDIO
          </span>
          <span className="text-[#E7E4DD] text-sm font-light">/</span>
          <span
            className="text-[10px] tracking-[0.18em] uppercase text-[#9B9891] font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Management Console
          </span>
        </div>
      </div>

      {/* Right: live store link + user */}
      <div className="flex items-center gap-5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 transition-colors duration-150 group"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#6F6D68] group-hover:text-[#171717] font-normal transition-colors duration-150">
            Live Store
          </span>
          <ExternalLink size={10} strokeWidth={1.5} className="text-[#9B9891] group-hover:text-[#6F6D68] transition-colors duration-150" />
        </Link>

        <div className="h-3.5 w-px bg-[#E7E4DD] hidden sm:block" />

        <div className="flex items-center gap-2">
          {/* Avatar circle */}
          <div
            className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-normal flex-shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block">
            <p
              className="text-[11px] font-medium text-[#171717] leading-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Admin
            </p>
            <p
              className="text-[10px] text-[#9B9891] leading-tight truncate max-w-[130px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {adminEmail || 'Administrator'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
