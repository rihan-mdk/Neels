import React from 'react';
import Link from 'next/link';

export default function QuickActions() {
  const ACTIONS = [
    {
      title: 'Add New Product',
      desc: 'Create and publish a new couture item to the catalog',
      href: '/admin/products',
    },
    {
      title: 'Manage Categories',
      desc: 'Organise silhouettes and atelier product lines',
      href: '/admin/categories',
    },
    {
      title: 'Curate Collections',
      desc: 'Update seasonal edits and editorial collections',
      href: '/admin/collections',
    },
    {
      title: 'Review Orders',
      desc: 'Process and manage customer orders',
      href: '/admin/orders',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[4px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3.5 border-b border-[#E4E1DA] flex items-center justify-between">
        <div>
          <h2
            className="text-[20px] font-normal text-[#171717] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Quick Actions
          </h2>
          <p
            className="text-[11px] text-[#99958D] mt-0.5 font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Common studio workflows and shortcuts
          </p>
        </div>
      </div>

      {/* Actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E1DA]">
        {ACTIONS.map((action) => {
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group p-5 flex flex-col items-center justify-center text-center h-[104px] hover:bg-[#F7F6F2] transition-colors duration-150"
            >
              <p
                className="text-[13px] font-semibold text-[#111111] leading-tight group-hover:text-black"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {action.title} →
              </p>
              <p
                className="text-[11px] text-[#88847C] mt-1 leading-snug font-normal line-clamp-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {action.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
