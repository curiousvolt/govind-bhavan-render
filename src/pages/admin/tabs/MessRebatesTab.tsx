import React from 'react';
import { AdminTable } from '../../../components/AdminTable';
import { CSVExportButton } from '../../../components/CSVExportButton';
import { useMessRebate } from '../../../context/MessRebateContext';
import toast from 'react-hot-toast';

export const MessRebatesTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { rebates, updateRebateStatus } = useMessRebate();

  const filteredRebates = rebates.filter(r => 
    searchQuery === '' || 
    r.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    updateRebateStatus(id, action);
    toast.success(`Rebate request ${action.toLowerCase()}`);
  };

  const columns = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'fromDate', label: 'From Date', sortable: true },
    { key: 'toDate', label: 'To Date', sortable: true },
    { key: 'reason', label: 'Reason' },
    { key: 'submittedOn', label: 'Submitted On', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string, row: any) => {
        if (value === 'Pending') {
          return (
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(row.id, 'Approved')}
                className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all"
              >
                Approve
              </button>
              <button 
                onClick={() => handleAction(row.id, 'Rejected')}
                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all"
              >
                Reject
              </button>
            </div>
          );
        }
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
            value === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
            'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {value}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div>
          <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Mess Rebate Requests</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Review and manage student mess rebates</p>
        </div>
        <CSVExportButton data={filteredRebates} filename="mess_rebates" />
      </div>

      <AdminTable columns={columns} data={filteredRebates} />
    </div>
  );
};
