import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { parseISO } from 'date-fns';
import { useMessRebate } from '../context/MessRebateContext';
import { useAuth } from '../context/AuthContext';

const rebateSchema = z.object({
  fromDate: z.string().min(1, 'Start date is required'),
  toDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
}).refine((data) => {
  const start = parseISO(data.fromDate);
  const end = parseISO(data.toDate);
  return end >= start;
}, {
  message: "End date must be after or equal to start date",
  path: ["toDate"]
});

type RebateFormValues = z.infer<typeof rebateSchema>;

export const MessRebateForm = () => {
  const { addRebate } = useMessRebate();
  const { user } = useAuth();
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<RebateFormValues>({
    resolver: zodResolver(rebateSchema),
  });

  const fromDate = watch('fromDate');

  const onSubmit = async (data: RebateFormValues) => {
    if (!user) return;
    try {
      await addRebate({
        studentId: user._id,
        student: user.name,
        room: user.room || 'Unknown',
        ...data,
      });
      toast.success('Mess rebate request submitted');
      reset();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Apply for Mess Rebate</h3>
        <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Rebate Request</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">From Date</label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            {...register('fromDate')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
          {errors.fromDate && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.fromDate.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">To Date</label>
          <input 
            type="date" 
            min={fromDate || new Date().toISOString().split('T')[0]}
            {...register('toDate')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
          />
          {errors.toDate && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.toDate.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Reason</label>
        <input 
          type="text" 
          placeholder="e.g., Going home for holidays"
          {...register('reason')}
          className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
        />
        {errors.reason && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.reason.message}</p>}
      </div>

      <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-500/10 font-medium">
        Note: Rebate must be applied at least 2 days in advance. Minimum duration is 3 days.
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white  font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 shadow-lg shadow-primary-600/20"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};
