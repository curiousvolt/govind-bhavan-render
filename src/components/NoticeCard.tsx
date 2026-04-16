import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Pin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

interface NoticeCardProps {
  notice: any;
}

const categoryColors: Record<string, string> = {
  Event: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 ring-1 ring-purple-600/10 dark:ring-purple-400/20',
  Academic: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 ring-1 ring-blue-600/10 dark:ring-blue-400/20',
  Sports: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 ring-1 ring-emerald-600/10 dark:ring-emerald-400/20',
  Maintenance: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 ring-1 ring-amber-600/10 dark:ring-amber-400/20',
  General: 'bg-gray-50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300 ring-1 ring-gray-600/10 dark:ring-gray-400/20',
};

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 border shadow-sm transition-all flex flex-col h-full",
        notice.pinned ? "border-primary-500/50 dark:border-primary-500/50 shadow-primary-500/5" : "border-gray-100 dark:border-white/5"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", categoryColors[notice.category] || categoryColors.General)}>
          {notice.category}
        </span>
        {notice.pinned && (
          <Pin size={16} className="text-primary-600 dark:text-primary-400 fill-current" />
        )}
      </div>
      
      <h3 className="text-lg  font-medium text-gray-900 dark:text-white mb-3 line-clamp-2">
        {notice.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
        {notice.description}
      </p>
      
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
        <Calendar size={14} className="mr-1.5" />
        {format(new Date(notice.date), 'MMM dd, yyyy')}
      </div>
    </motion.div>
  );
};
