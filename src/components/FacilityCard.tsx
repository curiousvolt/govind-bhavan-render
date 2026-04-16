import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FacilityCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  timing?: string;
  image?: string;
  delay?: number;
}

export const FacilityCard = ({ title, description, icon: Icon, timing, image, delay = 0 }: FacilityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-[#1e1e1e] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all"
    >
      {image && (
        <div className="h-56 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-8">
        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <h3 className="text-xl  font-medium text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          {description}
        </p>
        {timing && (
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
            {timing}
          </div>
        )}
      </div>
    </motion.div>
  );
};
