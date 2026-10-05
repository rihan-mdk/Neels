'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { X } from 'lucide-react';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminEmail?: string;
}

export default function AdminLayoutClient({
  children,
  adminEmail,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex">
      {/* Desktop Sidebar — fixed width, full height */}
      <div className="hidden md:block w-[200px] flex-shrink-0 h-screen sticky top-0">
        <AdminSidebar adminEmail={adminEmail} />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex flex-col w-[200px] bg-[#0D0D0D] z-50 h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1 text-white/40 hover:text-white/80 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
            <AdminSidebar adminEmail={adminEmail} onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminHeader
          onToggleSidebar={() => setMobileOpen((prev) => !prev)}
          adminEmail={adminEmail}
        />
        <main className="flex-1 px-8 sm:px-12 md:px-16 lg:px-20 py-8 md:py-10 max-w-[1700px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
