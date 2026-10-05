import React from 'react';
import { createClient } from '@/lib/supabase/server';
import RecentOrdersTable, { OrderPreview } from '@/components/admin/dashboard/RecentOrdersTable';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: ordersData } = await supabase
    .from('orders')
    .select('id, customer_name, customer_email, total_amount, status, created_at')
    .order('created_at', { ascending: false });

  const orders: OrderPreview[] = (ordersData || []).map((o) => ({
    id: o.id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    totalAmount: Number(o.total_amount) || 0,
    status: o.status,
    createdAt: o.created_at,
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E4E1DA] pb-5">
        <h1
          className="text-3xl md:text-[32px] font-normal text-[#171717] tracking-tight leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Orders Management
        </h1>
        <p
          className="text-[12px] text-[#68655F] mt-1.5 font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Inspect client purchases, bespoke inquiries, and update fulfillment statuses
        </p>
      </div>

      <RecentOrdersTable orders={orders} />
    </div>
  );
}
