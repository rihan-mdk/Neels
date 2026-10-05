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
    <aside className="w-[200px] bg-[#0D0D0D] flex flex-col h-full select-none">
      {/* Brand */}
      <div className="px-5 pt-7 pb-7 border-b border-white/[0.08]">
        <Link href="/admin" onClick={onCloseMobile} className="block group">
          <span
            className="block text-[19px] font-light text-[#FFFFFF] tracking-tight leading-none group-hover:text-white/90 transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            NEEL'S
          </span>
          <span
            className="block text-[9.5px] tracking-[0.22em] uppercase text-[#99958D] font-normal mt-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ATELIER ADMIN
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-8">
        <AdminNavLinks onItemClick={onCloseMobile} />
      </div>

      {/* Footer */}
      <div className="px-3 py-3.5 border-t border-white/10 space-y-2 shrink-0 bg-[#0D0D0D]">
        {/* Storefront link */}
        <Link
          href="/"
          className="flex items-center px-3.5 py-2 text-white hover:bg-white/[0.08] transition-colors duration-150 rounded-[4px]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-[12px] tracking-[0.08em] uppercase font-normal text-white">Storefront</span>
        </Link>

        {/* User row */}
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-2.5 overflow-hidden mr-1.5">
            <div className="w-8 h-8 rounded-full bg-[#242424] border border-[#414141] text-[#FFFFFF] flex items-center justify-center text-[11px] font-medium shrink-0">
              {adminEmail ? adminEmail[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p
                className="text-[12px] font-normal text-[#FFFFFF] truncate leading-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Admin
              </p>
              <p
                className="text-[10px] text-[#99958D] truncate leading-tight mt-0.5"
                title={adminEmail || 'admin@neels.atelier'}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {adminEmail?.split('@')[0] || 'admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="text-[10px] uppercase tracking-wider text-[#99958D] hover:text-[#FFFFFF] py-1 px-1.5 transition-colors duration-150 rounded-[3px] hover:bg-white/[0.08] flex-shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
