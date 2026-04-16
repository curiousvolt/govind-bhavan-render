import React from 'react';
import { Download } from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

interface CSVExportButtonProps {
  data: any[];
  filename: string;
}

export const CSVExportButton = ({ data, filename }: CSVExportButtonProps) => {
  return (
    <button
      onClick={() => exportToCSV(data, filename)}
      className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-xs  font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
    >
      <Download size={14} className="text-primary-600 dark:text-primary-400" />
      Export CSV
    </button>
  );
};
