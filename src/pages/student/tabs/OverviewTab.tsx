import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../context/AuthContext';
import { useComplaint } from '../../../context/ComplaintContext';
import { useEvent } from '../../../context/EventContext';
import { StatCard } from '../../../components/StatCard';
import { cn } from '../../../utils/cn';

export const OverviewTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { user } = useAuth();
  const { complaints } = useComplaint();
  const { events } = useEvent();
  
  const userComplaints = complaints.filter(c => c.student === user?.name);
  const activeComplaints = userComplaints.filter(c => c.status !== 'Resolved').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-10 shadow-sm group">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">{getGreeting()}, {user?.name.split(' ')[0]}!</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back to your personal dashboard. Here's what's happening in Govind Bhawan today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard end={activeComplaints} label="Active Complaints" />
        <StatCard end={events.filter(e => new Date(e.date) >= new Date()).length} label="Upcoming Events" />
        <StatCard end={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} label="Mess Days Left" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 text-center shadow-sm flex flex-col justify-center"
        >
          <div className="text-4xl  font-bold text-primary-600 dark:text-primary-400 mb-1">{user?.room}</div>
          <div className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">Room Number</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Last 3 items</span>
          </div>
          <div className="space-y-6">
            {userComplaints.slice(0, 3).map((complaint, i) => (
              <div key={i} className="flex items-start gap-5 pb-6 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                <div className="w-2.5 h-2.5 mt-2 rounded-full bg-primary-500 shrink-0 shadow-sm shadow-primary-500/50" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Complaint: {complaint.category}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                      complaint.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                    )}>
                      {complaint.status}
                    </span>
                    <span>•</span>
                    <span>{complaint.date}</span>
                  </p>
                </div>
              </div>
            ))}
            {userComplaints.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
            <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Next 3 events</span>
          </div>
          <div className="space-y-6">
            {[...events].filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3).map((event, i) => (
              <div key={i} className="flex items-start gap-5 pb-6 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex flex-col items-center justify-center shrink-0 border border-primary-100/50 dark:border-primary-500/10">
                  <span className="text-sm  font-bold text-primary-700 dark:text-primary-300">{event.date.split('-')[2]}</span>
                  <span className="text-[9px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-tighter">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-mono uppercase tracking-widest">{event.category}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
