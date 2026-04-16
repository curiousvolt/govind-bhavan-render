import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useComplaint } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';

const complaintSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  room: z.string().min(1, 'Room number is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export const ComplaintForm = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaint();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      room: user?.room || '',
    }
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    if (!user) return;
    try {
      await addComplaint({
        studentId: user._id,
        student: user.name,
        room: data.room,
        category: data.category,
        description: data.description,
      });
      toast.success('Complaint registered successfully');
      reset({ room: user?.room || '', category: '', description: '' });
    } catch (error) {
      toast.error('Failed to register complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl  font-bold text-gray-900 dark:text-white">File a Complaint</h3>
        <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Formal Request</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Category</label>
          <select 
            {...register('category')}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm custom-select"
          >
            <option value="">Select category</option>
            <option value="Water Issue">Water Issue</option>
            <option value="Electrical">Electrical</option>
            <option value="Furniture">Furniture</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Internet">Internet</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.category.message}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Room Number</label>
          <input 
            type="text" 
            {...register('room')}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-100/50 dark:bg-black/40 text-gray-400 dark:text-gray-500 outline-none cursor-not-allowed text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Description</label>
        <textarea 
          {...register('description')}
          rows={4}
          placeholder="Please describe the issue in detail..."
          className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none text-sm"
        />
        {errors.description && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.description.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white  font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 shadow-lg shadow-primary-600/20"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};
