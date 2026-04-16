import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
}

export const AdminTable = ({ columns, data, onRowClick, defaultSort }: AdminTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(defaultSort || null);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
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
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm">
      <table className="w-full min-w-max text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-400 dark:text-gray-500 border-b border-gray-50 dark:border-white/5">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={cn("px-8 py-4 font-mono text-[10px] uppercase tracking-widest", col.sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5")}
                onClick={() => col.sortable && requestSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortConfig?.key === col.key && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {sortedData.map((row, i) => (
            <tr 
              key={row.id || i} 
              className={cn("hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group", onRowClick && "cursor-pointer")}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={`${row.id || i}-${col.key}`} className="px-8 py-5 text-gray-600 dark:text-gray-400 ">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 italic ">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
