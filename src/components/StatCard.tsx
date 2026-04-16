import React from 'react';
import { motion } from 'motion/react';
import { useCountUp } from '../hooks/useCountUp';

interface StatCardProps {
  end: number;
  label: string;
  suffix?: string;
  delay?: number;
}

export const StatCard = ({ end, label, suffix = '', delay = 0 }: StatCardProps) => {
  const count = useCountUp(end, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-4xl  font-bold text-primary-600 dark:text-primary-400 mb-1">
        {count}{suffix}
      </div>
      <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {label}
      </div>
    </motion.div>
  );
};
