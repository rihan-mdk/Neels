import React from 'react';
import { Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#181515]">Registered Customers</h1>
        <p className="text-xs text-[#8E867E] mt-0.5">
          Review customer accounts and profile contact information
        </p>
      </div>

      <div className="bg-[#FFFDFC] border border-[#E5DFD7] rounded-xl shadow-sm overflow-hidden">
        {(!customers || customers.length === 0) ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#181515]/5 text-[#8E867E] flex items-center justify-center mb-4">
              <Users size={26} />
            </div>
            <h3 className="text-sm font-semibold text-[#181515]">No registered customers</h3>
            <p className="text-xs text-[#8E867E] mt-1 max-w-sm">
              Customer accounts will be listed here when visitors register on the boutique website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5F0] text-[#8E867E] uppercase tracking-wider text-[10px] border-b border-[#E5DFD7]">
                <tr>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Phone</th>
                  <th className="py-3 px-5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3.5 px-5 font-medium text-[#181515]">
                      {c.full_name || 'Studio Member'}
                    </td>
                    <td className="py-3.5 px-5 text-[#5A524D]">{c.email}</td>
                    <td className="py-3.5 px-5 text-[#8E867E]">{c.phone || '—'}</td>
                    <td className="py-3.5 px-5 text-[#8E867E]">
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
