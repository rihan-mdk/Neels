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
    <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[4px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#E4E1DA] flex items-center justify-between">
        <div>
          <h2
            className="text-[20px] font-normal text-[#171717] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Recent Orders
          </h2>
          <p
            className="text-[11px] text-[#99958D] mt-0.5 font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Latest client transactions and fulfillment status
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="text-[10.5px] tracking-[0.14em] uppercase text-[#171717] hover:text-[#68655F] transition-colors duration-150 font-semibold inline-flex items-center gap-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span>View All</span>
          <span>→</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="h-[120px] flex flex-col items-center justify-center text-center px-4">
          <h3
            className="text-[13px] font-medium text-[#171717]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            No customer orders yet
          </h3>
          <p
            className="text-[11px] text-[#99958D] mt-1 max-w-xs font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Orders placed on the storefront will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F7F6F2] border-b border-[#E4E1DA]">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Status', ''].map((col, i) => (
                  <th
                    key={col || i}
                    className={`py-3 px-5 text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#68655F] ${i === 5 ? 'text-right' : ''}`}
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
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#68655F]">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-3.5 px-5">
                      <p
                        className="text-[12.5px] font-medium text-[#171717] leading-tight"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.customerName}
                      </p>
                      <p
                        className="text-[10.5px] text-[#99958D] mt-0.5 font-normal truncate max-w-[200px]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.customerEmail}
                      </p>
                    </td>
                    <td
                      className="py-3.5 px-5 text-[11px] text-[#68655F] font-normal whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td
                      className="py-3.5 px-5 text-[12.5px] font-medium text-[#171717] whitespace-nowrap"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[9.5px] font-medium border tracking-[0.08em] uppercase rounded-[2px] ${statusStyle}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[10.5px] font-medium text-[#68655F] hover:text-[#171717] transition-colors duration-150 tracking-[0.1em] uppercase"
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
