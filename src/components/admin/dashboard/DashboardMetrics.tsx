import React from 'react';

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  totalRevenueFormatted: string;
}

export default function DashboardMetrics({ stats }: { stats: DashboardStats }) {
  const METRIC_CARDS = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      sub: `${stats.totalProducts} in catalog`,
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      sub: `${stats.totalProducts - stats.activeProducts} draft`,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      sub: 'All customer orders',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      sub: 'Registered accounts',
    },
    {
      title: 'Revenue',
      value: stats.totalRevenueFormatted,
      sub: 'From completed orders',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {METRIC_CARDS.map((card) => {
        return (
          <div
            key={card.title}
            className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[6px] p-5 flex flex-col items-center justify-center text-center hover:border-[#111111]/30 transition-colors shadow-xs"
          >
            <span
              className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#68655F]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {card.title}
            </span>
            <p
              className="text-[28px] font-normal leading-tight text-[#111111] my-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {card.value}
            </p>
            <p
              className="text-[11px] text-[#99958D] font-normal leading-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
