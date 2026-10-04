import React from 'react';
import { Shirt, Sparkles, ShoppingBag, Users, IndianRupee } from 'lucide-react';

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
      icon: Shirt,
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      sub: `${stats.totalProducts - stats.activeProducts} draft`,
      icon: Sparkles,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      sub: 'All customer orders',
      icon: ShoppingBag,
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      sub: 'Registered accounts',
      icon: Users,
    },
    {
      title: 'Revenue',
      value: stats.totalRevenueFormatted,
      sub: 'From completed orders',
      icon: IndianRupee,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {METRIC_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-[#FFFFFF] border border-[#E7E4DD] p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <span
                className="text-[9px] font-normal tracking-[0.18em] uppercase text-[#9B9891]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {card.title}
              </span>
              <Icon size={13} strokeWidth={1.3} className="text-[#9B9891] flex-shrink-0" />
            </div>
            <div>
              <p
                className="text-[26px] font-light leading-none text-[#171717]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {card.value}
              </p>
              <p
                className="text-[10px] text-[#9B9891] mt-1.5 font-normal"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {card.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
