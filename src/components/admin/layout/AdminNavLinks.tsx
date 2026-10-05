'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin', exact: true },
  { name: 'Products', href: '/admin/products' },
  { name: 'Categories', href: '/admin/categories' },
  { name: 'Collections', href: '/admin/collections' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Customers', href: '/admin/customers' },
];

export default function AdminNavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="px-3 pb-4 space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center px-4 h-[38px] transition-all duration-150 rounded-[4px] text-white ${
              isActive
                ? 'bg-[#242424] border border-[#414141] font-medium'
                : 'hover:bg-white/[0.08] border border-transparent font-normal opacity-90 hover:opacity-100'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="text-[13px] tracking-wide whitespace-nowrap text-white">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
