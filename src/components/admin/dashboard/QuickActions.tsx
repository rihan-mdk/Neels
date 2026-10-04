import React from 'react';
import Link from 'next/link';
import { Plus, FolderTree, Sparkles, ShoppingBag } from 'lucide-react';

export default function QuickActions() {
  const ACTIONS = [
    {
      title: 'Add New Product',
      desc: 'Create and publish a new couture item to the catalog',
      href: '/admin/products',
      icon: Plus,
    },
    {
      title: 'Manage Categories',
      desc: 'Organise silhouettes and atelier product lines',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      title: 'Curate Collections',
      desc: 'Update seasonal edits and editorial collections',
      href: '/admin/collections',
      icon: Sparkles,
    },
    {
      title: 'Review Orders',
      desc: 'Process and manage customer orders',
      href: '/admin/orders',
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E7E4DD]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E7E4DD]">
        <h2
          className="text-[20px] font-light text-[#171717]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Quick Actions
        </h2>
        <p
          className="text-[10px] text-[#9B9891] mt-0.5 tracking-wide font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Common management shortcuts
        </p>
      </div>

      {/* Actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E4DD]">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group p-5 flex flex-col gap-4 hover:bg-[#F7F6F2] transition-colors duration-150"
            >
              <div className="w-8 h-8 border border-[#E7E4DD] bg-[#F7F6F2] group-hover:bg-[#111111] group-hover:border-[#111111] flex items-center justify-center transition-colors duration-200">
                <Icon size={14} strokeWidth={1.5} className="text-[#6F6D68] group-hover:text-white transition-colors duration-200" />
              </div>
              <div>
                <p
                  className="text-[12px] font-medium text-[#171717] leading-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {action.title}
                </p>
                <p
                  className="text-[11px] text-[#9B9891] mt-1 leading-relaxed font-normal"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {action.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
