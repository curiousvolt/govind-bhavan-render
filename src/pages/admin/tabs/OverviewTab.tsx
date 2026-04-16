import React, { useMemo, useState, useEffect } from 'react';
import { StatCard } from '../../../components/StatCard';
import { useComplaint } from '../../../context/ComplaintContext';
import { useMessRebate } from '../../../context/MessRebateContext';
import { useGuestRoom } from '../../../context/GuestRoomContext';
import { useEvent } from '../../../context/EventContext';
import { getAllStudents } from '../../../api/students';

export const OverviewTab = () => {
  const { complaints } = useComplaint();
  const { rebates } = useMessRebate();
  const { bookings } = useGuestRoom();
  const { events } = useEvent();
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    getAllStudents().then(data => setTotalStudents(data.length || 0)).catch(console.error);
  }, []);
  
  const stats = useMemo(() => ({
    totalStudents,
    openComplaints: complaints.filter(c => c.status === 'Open').length,
    pendingRebates: rebates.filter(r => r.status === 'Pending').length,
    guestBookings: bookings.length,
  }), [complaints, rebates, bookings, totalStudents]);

  const complaintChartData = useMemo(() => {
    const categories = ['Electrical', 'Water Issue', 'Internet', 'Furniture', 'Cleanliness', 'Other'];
    return categories.map(cat => ({
      name: cat,
      count: complaints.filter(c => c.category === cat).length
    })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);
  }, [complaints]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard end={stats.totalStudents} label="Total Students" />
        <StatCard end={stats.openComplaints} label="Open Complaints" />
        <StatCard end={stats.pendingRebates} label="Pending Rebates" />
        <StatCard end={stats.guestBookings} label="Guest Bookings" suffix=" (Month)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clean Complaint Distribution */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm outline-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Complaints by Category</h3>
            <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Live Distribution</span>
          </div>
          
          <div className="space-y-5">
            {complaintChartData.map((data, i) => {
              const maxCount = Math.max(...complaintChartData.map(c => c.count), 1);
              const percentage = (data.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{data.name}</span>
                    <span className="font-mono text-gray-500 font-bold">{data.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
            {complaintChartData.length === 0 && (
              <p className="text-sm text-gray-400 italic py-4">No complaints recorded yet.</p>
            )}
          </div>
        </div>

        {/* Clean Rebates List */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm outline-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Rebate Requests</h3>
            <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Latest 5</span>
          </div>
          
          <div className="space-y-3">
            {[...rebates].reverse().slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-gray-200 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.student}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{r.fromDate} to {r.toDate}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                  r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  r.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                  'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
            {rebates.length === 0 && (
              <p className="text-sm text-gray-400 italic py-4">No recent requests.</p>
            )}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm outline-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
            <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Next 5</span>
          </div>
          
          <div className="space-y-3">
            {[...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-gray-200 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{e.title}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{e.date} · {e.registeredStudents?.length || 0} Registered</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                  e.status === 'Upcoming' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' :
                  'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                }`}>
                  {e.status}
                </span>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-gray-400 italic py-4">No upcoming events.</p>
            )}
          </div>
        </div>

        {/* Recent Guest Bookings List */}
        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm outline-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Guest Bookings</h3>
            <span className="text-[10px] font-mono text-primary-600 dark:text-primary-400 uppercase tracking-widest">Latest 5</span>
          </div>
          
          <div className="space-y-3">
            {[...bookings].reverse().slice(0, 5).map((b, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 hover:border-gray-200 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{b.guestName} <span className="text-gray-400 font-normal">({b.relation})</span></p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{b.checkIn} to {b.checkOut} · by {b.student}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                  b.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  b.status === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                  'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-sm text-gray-400 italic py-4">No recent bookings.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
