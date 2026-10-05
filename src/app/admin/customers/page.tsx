import React from 'react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E4E1DA] pb-5">
        <h1
          className="text-3xl md:text-[32px] font-normal text-[#171717] tracking-tight leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Registered Customers
        </h1>
        <p
          className="text-[12px] text-[#68655F] mt-1.5 font-normal"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Review atelier customer accounts, client profiles, and registration records
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E4E1DA] rounded-[4px] overflow-hidden">
        {(!customers || customers.length === 0) ? (
          <div className="h-[130px] flex flex-col items-center justify-center text-center px-4">
            <h3
              className="text-[13px] font-medium text-[#171717]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              No registered customers
            </h3>
            <p
              className="text-[11px] text-[#99958D] mt-1 max-w-xs font-normal"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Customer accounts will be listed here when visitors register on the boutique storefront.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-[#F7F6F2] border-b border-[#E4E1DA]">
                <tr>
                  <th
                    className="py-3 px-5 w-[25%] text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#68655F]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Name
                  </th>
                  <th
                    className="py-3 px-5 w-[35%] text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#68655F]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Email
                  </th>
                  <th
                    className="py-3 px-5 w-[20%] text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#68655F]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Phone
                  </th>
                  <th
                    className="py-3 px-5 w-[20%] text-[9.5px] font-semibold tracking-[0.14em] uppercase text-[#68655F]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEECE7]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F6F2] transition-colors">
                    <td
                      className="py-3.5 px-5 font-medium text-[#171717] text-[12.5px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {c.full_name || 'Studio Member'}
                    </td>
                    <td
                      className="py-3.5 px-5 text-[#68655F] text-[12px] truncate max-w-[240px]"
                      title={c.email}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {c.email}
                    </td>
                    <td
                      className="py-3.5 px-5 text-[#99958D] text-[11.5px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {c.phone || '—'}
                    </td>
                    <td
                      className="py-3.5 px-5 text-[#99958D] text-[11.5px]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
