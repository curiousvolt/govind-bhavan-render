import React from 'react';
import { GuestRoomForm } from '../../../components/GuestRoomForm';
import { useAuth } from '../../../context/AuthContext';
import { useGuestRoom } from '../../../context/GuestRoomContext';

export const GuestRoomTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { user } = useAuth();
  const { bookings } = useGuestRoom();
  const userBookings = bookings.filter(b => 
    b.student === user?.name &&
    (searchQuery === '' || 
     b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     b.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <GuestRoomForm />
      
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Past Bookings</h3>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 dark:bg-black/20 text-gray-400 dark:text-gray-500">
              <tr>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Guest Name</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Check-in</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Check-out</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {userBookings.map((booking, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 text-gray-900 dark:text-white  font-medium">{booking.guestName}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-mono text-xs">{booking.checkIn}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-mono text-xs">{booking.checkOut}</td>
                  <td className="px-8 py-5 text-gray-600 dark:text-gray-400 font-mono text-xs">{booking.roomType}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                      booking.status === 'Cancelled' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {userBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 italic ">
                    No guest room bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
