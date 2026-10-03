'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export interface NavItem {
  id: number;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 0, label: 'Home', href: '/' },
  { id: 1, label: 'Collections', href: '/collections' },
  { id: 2, label: 'Accessories', href: '/jewellery' },
  { id: 3, label: 'Profile', href: '/profile' },
];

const LumaBar = () => {
  const pathname = usePathname();
  const [active, setActive] = useState(0);

  // Automatically sync active tab with current route
  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/') {
      setActive(0);
    } else if (
      pathname.startsWith('/collections') ||
      pathname.startsWith('/product') ||
      pathname.startsWith('/lehengas') ||
      pathname.startsWith('/sarees') ||
      pathname.startsWith('/suits-dresses')
    ) {
      setActive(1);
    } else if (pathname.startsWith('/jewellery') || pathname.startsWith('/accessories')) {
      setActive(2);
    } else if (
      pathname.startsWith('/profile') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/orders') ||
      pathname.startsWith('/wishlist')
    ) {
      setActive(3);
    }
  }, [pathname]);

  return (
    <nav
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto md:hidden"
      aria-label="Mobile Bottom Navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* 
        Clean, wide, spacious luxury text-only pill navigation 
        - Increased width (94vw up to 430px)
        - Increased height (52px)
        - Breathable padding & generous flex distribution
      */}
      <div className="relative flex items-center justify-between w-[94vw] max-w-[430px] h-[52px] bg-[#FFFDFC]/95 backdrop-blur-2xl rounded-full p-1.5 shadow-[0_16px_40px_rgba(24,21,21,0.13)] border border-[#D9A7A7]/50">
        {NAV_ITEMS.map((item, index) => {
          const isActive = index === active;
          return (
            <div key={item.id} className="relative flex-1 h-full">
              <Link
                href={item.href}
                onClick={() => setActive(index)}
                className={`relative flex items-center justify-center w-full h-full px-2 rounded-full transition-colors duration-200 select-none ${
                  isActive ? 'text-[#181515]' : 'text-[#66615D] hover:text-[#181515]'
                }`}
                aria-label={item.label}
              >
                {/* Active Sliding Pill Capsule */}
                {isActive && (
                  <motion.div
                    layoutId="active-mobile-pill"
                    className="absolute inset-0.5 bg-[#F7E9E7] border border-[#D9A7A7]/70 rounded-full -z-10 shadow-sm"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}

                {/* Clean, high-legibility typography with generous breathing room */}
                <span
                  className={`text-[11px] tracking-[0.12em] uppercase font-sans whitespace-nowrap transition-all ${
                    isActive
                      ? 'font-semibold text-[#181515] scale-[1.03]'
                      : 'font-normal text-[#66615D]'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default LumaBar;
