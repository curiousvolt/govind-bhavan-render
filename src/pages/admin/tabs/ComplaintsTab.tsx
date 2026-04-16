import React, { useState } from 'react';
import { AdminTable } from '../../../components/AdminTable';
import { CSVExportButton } from '../../../components/CSVExportButton';
import { useComplaint } from '../../../context/ComplaintContext';
import toast from 'react-hot-toast';
import { Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Water Issue', 'Electrical', 'Furniture', 'Cleanliness', 'Internet', 'Other'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

export const ComplaintsTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { complaints, updateComplaintStatus } = useComplaint();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = complaints.filter(c => {
    const matchSearch = searchQuery === '' ||
      c.student?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c as any).complaintId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'All' || c.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateComplaintStatus(id, newStatus as any);
    toast.success(`Status updated to ${newStatus}`);
  };

  const columns = [
    {
      key: 'complaintId', label: 'ID', sortable: true,
      render: (v: string, row: any) => (
        <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">
          {v || row._id?.slice(-6)}
        </span>
      )
    },
    { key: 'student', label: 'Student', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'description', label: 'Description', render: (v: string) => <div className="min-w-[300px] max-w-[400px] whitespace-normal leading-relaxed text-gray-700 dark:text-gray-300">{v}</div> },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (value: string, row: any) => (
        <select
          value={value}
          onChange={e => handleStatusChange(row._id || row.id, e.target.value)}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter border-none outline-none cursor-pointer custom-select pr-8 ${
            value === 'Resolved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
            value === 'In Progress' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
            'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
          }`}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Complaints</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor and resolve student issues</p>
          </div>
          <CSVExportButton data={filtered} filename="complaints_list" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest">
            <Filter size={12} /> Filters
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}>
                {s}
              </button>
            ))}
          </div>
          {(categoryFilter !== 'All' || statusFilter !== 'All') && (
            <button onClick={() => { setCategoryFilter('All'); setStatusFilter('All'); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              Clear filters
            </button>
          )}
        </div>

        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-3">{filtered.length} complaints</p>
      </div>

      <AdminTable columns={columns} data={filtered} defaultSort={{ key: 'date', direction: 'desc' }} />
    </div>
  );
};
