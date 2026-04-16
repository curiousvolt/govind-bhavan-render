import React, { useState, useMemo } from 'react';
import { ComplaintForm } from '../../../components/ComplaintForm';
import { useComplaint } from '../../../context/ComplaintContext';
import { useAuth } from '../../../context/AuthContext';
import { cn } from '../../../utils/cn';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const ComplaintsTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { user } = useAuth();
  const { complaints } = useComplaint();
  const userComplaints = complaints.filter(c => 
    c.student === user?.name &&
    (searchQuery === '' || 
     c.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     c.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });

  const sortedComplaints = useMemo(() => {
    let sortableItems = [...userComplaints];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [userComplaints, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-6">
      <ComplaintForm />
      
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Complaints</h3>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-400 dark:text-gray-500">
              <tr>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5" onClick={() => requestSort('id')}>
                  <div className="flex items-center gap-1">
                    ID
                    {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5" onClick={() => requestSort('category')}>
                  <div className="flex items-center gap-1">
                    Category
                    {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5" onClick={() => requestSort('date')}>
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5" onClick={() => requestSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {sortedComplaints.map((complaint, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 text-gray-900 dark:text-white font-bold">{complaint.complaintId || complaint.id}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400">{complaint.category}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-mono text-xs">{complaint.date}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                      complaint.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                      complaint.status === 'In Progress' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    )}>
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sortedComplaints.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                    No complaints found.
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
