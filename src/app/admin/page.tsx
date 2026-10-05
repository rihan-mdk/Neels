import React from 'react';
import { createClient } from '@/lib/supabase/server';
import DashboardMetrics, { DashboardStats } from '@/components/admin/dashboard/DashboardMetrics';
import RecentOrdersTable, { OrderPreview } from '@/components/admin/dashboard/RecentOrdersTable';
import QuickActions from '@/components/admin/dashboard/QuickActions';

export const revalidate = 0; // Dynamic data

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch live product counts
  const { count: totalProductsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: activeProductsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // 2. Fetch live order counts & revenue
  const { count: totalOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { data: recentOrdersData } = await supabase
    .from('orders')
    .select('id, customer_name, customer_email, total_amount, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Fetch customer count
  const { count: totalCustomersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Calculate live revenue from orders
  const { data: allOrdersRevenue } = await supabase
    .from('orders')
    .select('total_amount')
    .neq('status', 'Cancelled');

  const totalRevenue = (allOrdersRevenue || []).reduce(
    (acc, curr) => acc + (Number(curr.total_amount) || 0),
    0
  );

  const stats: DashboardStats = {
    totalProducts: totalProductsCount || 0,
    activeProducts: activeProductsCount || 0,
    totalOrders: totalOrdersCount || 0,
    totalCustomers: totalCustomersCount || 0,
    totalRevenue,
    totalRevenueFormatted: `₹${totalRevenue.toLocaleString('en-IN')}`,
  };

  const recentOrders: OrderPreview[] = (recentOrdersData || []).map((o) => ({
    id: o.id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    totalAmount: Number(o.total_amount) || 0,
    status: o.status,
    createdAt: o.created_at,
  }));

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="border-b border-[#E4E1DA] pb-5">
        <h1
          className="text-3xl md:text-[32px] font-normal text-[#171717] tracking-tight leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Atelier Overview
        </h1>
        <p
          className="text-[12px] text-[#68655F] mt-1.5 tracking-normal font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Live boutique statistics and executive studio metrics
        </p>
      </div>

      {/* KPI Metric Cards */}
      <DashboardMetrics stats={stats} />

      {/* Quick Action Shortcuts with >1cm breathing space above and below */}
      <div className="py-14 sm:py-16">
        <QuickActions />
      </div>

      {/* Recent Orders List */}
      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
}
