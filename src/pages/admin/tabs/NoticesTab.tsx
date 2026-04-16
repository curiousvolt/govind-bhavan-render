import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNotice, Notice } from '../../../context/NoticeContext';
import toast from 'react-hot-toast';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const noticeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pinned: z.boolean(),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

export const NoticesTab = () => {
  const { notices, addNotice, deleteNotice, editNotice } = useNotice();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: { pinned: false }
  });

  useEffect(() => {
    if (editingNoticeId) {
      const noticeToEdit = notices.find(n => n.id === editingNoticeId);
      if (noticeToEdit) {
        setValue('title', noticeToEdit.title);
        setValue('category', noticeToEdit.category);
        setValue('description', noticeToEdit.description);
        setValue('pinned', noticeToEdit.pinned || false);
        setIsCreating(true);
      }
    }
  }, [editingNoticeId, notices, setValue]);

  const onSubmit = (data: NoticeFormValues) => {
    if (editingNoticeId) {
      editNotice(editingNoticeId, data);
      toast.success('Notice updated successfully');
    } else {
      addNotice({
        ...data,
        date: new Date().toISOString().split('T')[0],
      });
      toast.success('Notice published successfully');
    }
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingNoticeId(null);
    reset();
  };

  const handleEditClick = (notice: Notice) => {
    setEditingNoticeId(notice.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div>
          <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Manage Notices</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Create and manage important announcements for Govind Bhawan residents.</p>
        </div>
        <button 
          onClick={isCreating ? handleCloseForm : () => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm  font-bold transition-all shadow-lg shadow-primary-600/20"
        >
          {isCreating ? <X size={18} /> : <Plus size={18} />}
          {isCreating ? 'Cancel' : 'New Notice'}
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)} 
            className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 space-y-6 overflow-hidden shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Title</label>
                <input 
                  type="text" 
                  {...register('title')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                />
                {errors.title && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <select 
                  {...register('category')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm custom-select"
                >
                  <option value="">Select category</option>
                  <option value="Event">Event</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="General">General</option>
                </select>
                {errors.category && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Content</label>
              <textarea 
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm resize-none"
              />
              {errors.description && <p className="text-red-500 text-[10px] mt-2 font-medium">{errors.description.message}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="pinned" 
                {...register('pinned')}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="pinned" className="text-sm  font-medium text-gray-700 dark:text-gray-300">Pin to top of noticeboard</label>
            </div>

            <button 
              type="submit"
              className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white  font-bold transition-all shadow-lg shadow-primary-600/20"
            >
              {editingNoticeId ? 'Update Notice' : 'Publish Notice'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest">Title</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest">Pinned</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 text-gray-900 dark:text-white  font-bold">{notice.title}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                      {notice.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-500 dark:text-gray-400 font-mono text-xs">{notice.date}</td>
                  <td className="px-8 py-5 text-gray-500 dark:text-gray-400 font-mono text-xs">{notice.pinned ? 'Yes' : 'No'}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(notice)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          deleteNotice(notice.id);
                          toast.success('Notice deleted');
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
