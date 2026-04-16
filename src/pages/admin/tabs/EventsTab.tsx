import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Calendar, Plus, X, Edit2, Download } from 'lucide-react';
import { useEvent, Event } from '../../../context/EventContext';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  maxRegistrations: z.number().min(1, 'Must allow at least 1 registration'),
});

type EventFormValues = z.infer<typeof eventSchema>;

export const EventsTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { events, addEvent, editEvent } = useEvent();
  const [isCreating, setIsCreating] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = events.filter(e =>
    searchQuery === '' ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  useEffect(() => {
    if (editingEventId) {
      const ev = events.find(e => e.id === editingEventId);
      if (ev) {
        setValue('title', ev.title);
        setValue('category', ev.category);
        setValue('date', ev.date);
        setValue('maxRegistrations', ev.maxRegistrations);
        setIsCreating(true);
      }
    }
  }, [editingEventId, events, setValue]);

  const onSubmit = async (data: EventFormValues) => {
    if (editingEventId) {
      await editEvent(editingEventId, data);
      toast.success('Event updated');
    } else {
      await addEvent(data);
      toast.success('Event created');
    }
    handleCloseForm();
  };

  const handleCloseForm = () => { setIsCreating(false); setEditingEventId(null); reset(); };

  const handleExport = (event: Event) => {
    const details = event.registeredStudentDetails || [];
    const headers = ['Name', 'Email', 'Enrollment No', 'Room', 'Branch', 'Mobile'];
    const rows = details.map((s: any) => [
      s.name || '', s.email || '', s.enrollmentNo || '', s.room || '', s.branch || '', s.mobile || ''
    ]);
    const csv = [headers, ...rows].map(r => r.map((v: string) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '_')}_participants.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Events</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{events.length} events total</p>
        </div>
        <button onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-600/20">
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-900 dark:text-white">{editingEventId ? 'Edit Event' : 'New Event'}</h4>
              <button onClick={handleCloseForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Title</label>
                <input {...register('title')} placeholder="Event title" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <select {...register('category')} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm custom-select">
                  <option value="">Select category</option>
                  {['Sports', 'Cultural', 'Academic', 'Social', 'Technical'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-[10px] mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Date</label>
                <input type="date" {...register('date')} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                {errors.date && <p className="text-red-500 text-[10px] mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Max Registrations</label>
                <input type="number" {...register('maxRegistrations', { valueAsNumber: true })} min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                {errors.maxRegistrations && <p className="text-red-500 text-[10px] mt-1">{errors.maxRegistrations.message}</p>}
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={handleCloseForm} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70">
                  {isSubmitting ? 'Saving…' : editingEventId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(event => {
          const details = event.registeredStudentDetails || [];
          return (
            <div key={event.id} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">{event.category}</span>
                  <h4 className="font-bold text-gray-900 dark:text-white mt-1 truncate">{event.title}</h4>
                  <p className="text-xs text-gray-500 font-mono mt-1">{event.date}</p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <button onClick={() => { setEditingEventId(event.id); }}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleExport(event)}
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Export participants CSV">
                    <Download size={14} />
                  </button>
                  <button onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View participants">
                    <Users size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full h-1.5">
                  <div className="bg-primary-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (event.registeredStudents.length / event.maxRegistrations) * 100)}%` }} />
                </div>
                <span className="text-xs font-mono text-gray-500">{event.registeredStudents.length}/{event.maxRegistrations}</span>
                <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                  event.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-500'
                }`}>{event.status}</span>
              </div>

              {/* Participants Panel */}
              <AnimatePresence>
                {selectedEvent?.id === event.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-5 pt-5 border-t border-gray-50 dark:border-white/5 overflow-hidden">
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-3">Registered Participants ({details.length})</p>
                    {details.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No registrations yet.</p>
                    ) : (
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                        {details.map((s: any, i: number) => (
                          <div key={s._id || i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold shrink-0">
                              {s.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.name}</p>
                              <p className="text-[10px] font-mono text-gray-500 truncate">{s.enrollmentNo} · {s.room} · {s.branch}</p>
                              <p className="text-[10px] text-gray-400 truncate">{s.email} · {s.mobile}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <Calendar size={40} className="mx-auto mb-4 opacity-30" />
            <p className="italic">No events found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
