import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export interface OrderPreview {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  delivered:   'text-[#2D6A4F] bg-[#F0F7F3] border-[#C3E6D3]',
  processing:  'text-[#171717] bg-[#F3F0E9] border-[#E7E4DD]',
  pending:     'text-[#6F6D68] bg-[#F7F6F2] border-[#E7E4DD]',
  cancelled:   'text-[#9B9891] bg-[#F7F6F2] border-[#EEECE7]',
};

export default function RecentOrdersTable({ orders }: { orders: OrderPreview[] }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E7E4DD]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E7E4DD] flex items-center justify-between">
        <div>
          <h2
            className="text-[20px] font-light text-[#171717]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Recent Orders
          </h2>
          <p
            className="text-[10px] text-[#9B9891] mt-0.5 font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Latest customer orders and statuses
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="text-[10px] tracking-[0.12em] uppercase text-[#6F6D68] hover:text-[#171717] transition-colors duration-150 font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          View All →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 bg-[#F7F6F2] border border-[#E7E4DD] flex items-center justify-center mb-4">
            <ShoppingBag size={18} strokeWidth={1.3} className="text-[#9B9891]" />
          </div>
          <h3
            className="text-[13px] font-normal text-[#171717]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No customer orders yet
          </h3>
          <p
            className="text-[11px] text-[#9B9891] mt-1.5 max-w-xs leading-relaxed font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Orders placed on the storefront will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F7F6F2] border-b border-[#E7E4DD]">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Status', ''].map((col, i) => (
                  <th
                    key={col || i}
                    className={`py-3 px-5 text-[9px] font-normal tracking-[0.16em] uppercase text-[#9B9891] ${i === 5 ? 'text-right' : ''}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEECE7]">
              {orders.map((order) => {
                const statusKey = order.status.toLowerCase();
                const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
                return (
                  <tr key={order.id} className="hover:bg-[#F7F6F2] transition-colors duration-100">
                    <td
                      className="py-3.5 px-5 font-mono text-[10px] text-[#6F6D68]"
                    >
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-3.5 px-5">
                      <p
                        className="text-[12px] font-normal text-[#171717]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.customerName}
                      </p>
                      <p
                        className="text-[10px] text-[#9B9891] mt-0.5 font-normal"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.customerEmail}
                      </p>
                    </td>
                    <td
                      className="py-3.5 px-5 text-[11px] text-[#6F6D68] font-normal"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td
                      className="py-3.5 px-5 text-[12px] font-normal text-[#171717]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[9px] font-normal border tracking-[0.1em] uppercase ${statusStyle}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[10px] font-normal text-[#6F6D68] hover:text-[#171717] transition-colors duration-150 tracking-[0.1em] uppercase"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
