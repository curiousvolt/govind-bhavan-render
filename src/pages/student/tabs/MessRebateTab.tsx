import React from 'react';
import { MessRebateForm } from '../../../components/MessRebateForm';
import { useAuth } from '../../../context/AuthContext';
import { useMessRebate } from '../../../context/MessRebateContext';

export const MessRebateTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { user } = useAuth();
  const { rebates } = useMessRebate();
  const userRebates = rebates.filter(r => 
    r.student === user?.name &&
    (searchQuery === '' || 
     r.reason.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <MessRebateForm />
      
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Past Requests</h3>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-400 dark:text-gray-500">
              <tr>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">From</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">To</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Reason</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {userRebates.map((rebate, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-mono text-xs">{rebate.fromDate}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-mono text-xs">{rebate.toDate}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400  font-medium">{rebate.reason}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      rebate.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                      rebate.status === 'Rejected' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      {rebate.status}
                    </span>
                  </td>
                </tr>
              ))}
              {userRebates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 italic ">
                    No rebate requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
