import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminLayoutClient from '@/components/admin/layout/AdminLayoutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console — Neel’s Designer Studio',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verify claims / session
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims) {
    redirect('/login?redirect=/admin');
  }

  // 2. Secondary Server Component verification of admin role
  const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

  if (rpcError || !isAdmin) {
    redirect('/');
  }

  // 3. Extract verified user email from claims
  const jwtClaims = claims?.claims as Record<string, unknown> | undefined;
  const adminEmail = typeof jwtClaims?.email === 'string' ? jwtClaims.email : 'Administrator';

  return (
    <AdminLayoutClient adminEmail={adminEmail}>
      {children}
    </AdminLayoutClient>
  );
}
