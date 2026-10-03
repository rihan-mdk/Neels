'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, Gem, User } from 'lucide-react';

interface NavItem {
  id: number;
  label: string;
  href: string;
  Icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 0, label: 'Home',        href: '/',            Icon: Home },
  { id: 1, label: 'Collections', href: '/collections', Icon: LayoutGrid },
  { id: 2, label: 'Accessories', href: '/jewellery',   Icon: Gem },
  { id: 3, label: 'Profile',     href: '/profile',     Icon: User },
];

const LumaBar = () => {
  const pathname = usePathname();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

  if (!mounted) return null;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: '94vw',
        maxWidth: 460,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Floating navbar container */}
      <div
        style={{
          background: '#FFFDFC',
          border: '1px solid #DCCFC8',
          borderRadius: 22,
          boxShadow: '0 4px 24px rgba(24, 21, 21, 0.08), 0 1px 4px rgba(24, 21, 21, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* ── Nav items row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            height: 58,
          }}
        >
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === active;
            const { Icon } = item;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActive(index)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  textDecoration: 'none',
                  minWidth: 44,
                  padding: '6px 4px',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Active capsule */}
                {isActive && (
                  <motion.div
                    layoutId="nav-capsule"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    style={{
                      position: 'absolute',
                      inset: '6px 8px',
                      background: '#F7E9E7',
                      borderRadius: 14,
                      border: '1px solid #D9A7A7',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{ scale: isActive ? 1.03 : 1 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{ position: 'relative', zIndex: 1, lineHeight: 0 }}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.6}
                    style={{
                      color: isActive ? '#B57A7A' : 'rgba(24, 21, 21, 0.45)',
                      transition: 'color 180ms ease',
                    }}
                  />
                </motion.div>

                {/* Label */}
                <span
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    fontSize: 10,
                    fontWeight: isActive ? 500 : 400,
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    letterSpacing: '0.04em',
                    color: isActive ? '#181515' : 'rgba(24, 21, 21, 0.45)',
                    transition: 'color 180ms ease',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default LumaBar;
