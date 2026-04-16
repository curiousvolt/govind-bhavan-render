import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { useEvent } from '../../../context/EventContext';
import { useAuth } from '../../../context/AuthContext';

export const EventsTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { events, registerForEvent } = useEvent();
  const { user } = useAuth();

  const filteredEvents = events.filter(e => 
    searchQuery === '' || 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterToggle = async (id: string) => {
    if (!user?._id) return;
    const event = events.find(e => e.id === id);
    const isCurrentlyRegistered = event?.registeredStudentDetails
      ? event.registeredStudentDetails.some((s: any) => s._id?.toString() === user._id?.toString())
      : event?.registeredStudents.includes(user.name);
    try {
      await registerForEvent(id, user._id);
      if (isCurrentlyRegistered) {
        toast.success('Successfully unregistered from event');
      } else {
        toast.success('Successfully registered for event!');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bhavan Events</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Explore and register for upcoming events and workshops at Govind Bhawan.</p>
          </div>
          <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">All Events</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => {
              const isRegistered = user?._id
                ? (event.registeredStudentDetails
                    ? event.registeredStudentDetails.some((s: any) => s._id?.toString() === user._id?.toString())
                    : event.registeredStudents.includes(user.name))
                : false;
              const isFull = event.registeredStudents.length >= event.maxRegistrations;
              const isPast = new Date(event.date) < new Date(new Date().toISOString().split('T')[0]);

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={event.id} 
                  className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                      {event.category}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${event.status === 'Upcoming' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-4">{event.title}</h4>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                      <Calendar size={14} className="mr-3 text-primary-500" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                      <Clock size={14} className="mr-3 text-primary-500" />
                      18:00 - 20:00
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                      <MapPin size={14} className="mr-3 text-primary-500" />
                      Main Ground
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      {event.registeredStudents.length} / {event.maxRegistrations} Registered
                    </span>
                    {event.status === 'Upcoming' && (
                      <button 
                        onClick={() => handleRegisterToggle(event.id)}
                        disabled={(!isRegistered && isFull) || isPast}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          isPast 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-white/5 dark:text-gray-500 opacity-50'
                            : isRegistered 
                            ? 'border border-red-100 text-red-600 hover:bg-red-50 dark:border-red-900/20 dark:text-red-400 dark:hover:bg-red-900/10'
                            : isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-white/5 dark:text-gray-500'
                              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <Trash2 size={14} />
                            Unregister
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            {isPast ? 'Closed' : isFull ? 'Full' : 'Register'}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Calendar size={48} className="mx-auto text-gray-200 dark:text-white/5 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 italic">No events found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
