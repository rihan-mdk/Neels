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
      className="h-[58px] bg-[#FFFFFF] border-b border-[#E7E4DD] px-8 sm:px-12 md:px-16 lg:px-20 flex items-center justify-between sticky top-0 z-30 shrink-0"
    >
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 text-[#68655F] hover:text-[#171717] hover:bg-[#F3F0E9] transition-colors duration-150 rounded-[3px]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span
            className="text-[13px] font-normal text-[#171717] tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}
          >
            NEEL'S STUDIO
          </span>
          <span className="text-[#E4E1DA] text-sm font-light">/</span>
          <span
            className="text-[10.5px] tracking-[0.18em] uppercase text-[#99958D] font-medium"
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
          className="hidden sm:inline-flex items-center transition-colors duration-150 group"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-[10.5px] tracking-[0.14em] uppercase text-[#68655F] group-hover:text-[#171717] font-medium transition-colors duration-150">
            Live Store ↗
          </span>
        </Link>

        <div className="h-4 w-px bg-[#E4E1DA] hidden sm:block" />

        <div className="flex items-center gap-2.5">
          {/* Avatar circle */}
          <div
            className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-[11px] font-medium flex-shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden md:block">
            <p
              className="text-[12px] font-medium text-[#171717] leading-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Admin
            </p>
            <p
              className="text-[10px] text-[#99958D] leading-tight truncate max-w-[130px] mt-0.5"
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
