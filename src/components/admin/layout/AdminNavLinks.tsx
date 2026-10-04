'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  Sparkles,
  ShoppingBag,
  Users,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Products', href: '/admin/products', icon: Shirt },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Collections', href: '/admin/collections', icon: Sparkles },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

export default function AdminNavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="px-3 pb-4 space-y-[1cm]">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 rounded-sm ${
              isActive
                ? 'bg-white/[0.18] border border-white/30 text-white font-medium shadow-sm'
                : 'text-white hover:bg-white/[0.10] border border-transparent'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2 : 1.75}
              className="text-white flex-shrink-0"
            />
            <span className="text-[13px] tracking-wide text-white whitespace-nowrap">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
