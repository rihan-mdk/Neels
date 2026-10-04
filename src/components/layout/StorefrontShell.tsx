'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import CartNotification from '@/components/ui/CartNotification';
import BackToTop from '@/components/ui/BackToTop';
import LumaBar from '@/components/ui/futuristic-nav';

export default function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>
      <MobileHeader />
      <CartNotification />
      <BackToTop />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <LumaBar />
      <Footer />
    </>
  );
}
