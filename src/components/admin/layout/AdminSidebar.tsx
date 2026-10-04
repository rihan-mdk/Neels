'use client';

import React from 'react';
import Link from 'next/link';
import { Store, LogOut } from 'lucide-react';
import AdminNavLinks from './AdminNavLinks';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  adminEmail?: string;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ adminEmail, onCloseMobile }: AdminSidebarProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <aside className="w-[200px] bg-[#0D0D0D] flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 pt-7 pb-5 border-b border-[#F5F2EB]/[0.08]">
        <Link href="/admin" onClick={onCloseMobile} className="block">
          <span
            className="block text-[18px] font-light text-[#FAF8F5] tracking-tight leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            NEEL'S
          </span>
          <span
            className="block text-[9px] tracking-[0.22em] uppercase text-[#D8D2C5]/50 font-normal mt-1.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ATELIER ADMIN
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-[3cm]">
        <AdminNavLinks onItemClick={onCloseMobile} />
      </div>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/10 space-y-1">
        {/* Storefront link */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/[0.08] transition-colors duration-150 rounded-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Store size={14} strokeWidth={1.75} className="text-white" />
          <span className="text-[11px] tracking-[0.1em] uppercase font-normal text-white">Storefront</span>
        </Link>

        {/* User row */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="overflow-hidden mr-2">
            <p
              className="text-[9px] uppercase tracking-[0.14em] text-white/50 font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Signed in as
            </p>
            <p
              className="text-[11px] text-white/90 font-medium truncate mt-0.5"
              title={adminEmail || 'Admin'}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {adminEmail?.split('@')[0] || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="text-white/60 hover:text-white p-1 transition-colors duration-150 rounded-sm hover:bg-white/[0.08] flex-shrink-0"
          >
            <LogOut size={13} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
}
