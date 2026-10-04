import React from 'react';
import { ShoppingBag } from 'lucide-react';
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
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#181515]">Orders Management</h1>
        <p className="text-xs text-[#8E867E] mt-0.5">
          Inspect client purchases, bespoke orders, and update fulfillment statuses
        </p>
      </div>

      <RecentOrdersTable orders={orders} />
    </div>
  );
}
