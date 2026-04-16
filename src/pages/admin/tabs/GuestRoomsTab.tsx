import React from 'react';
import { AdminTable } from '../../../components/AdminTable';
import { CSVExportButton } from '../../../components/CSVExportButton';
import { useGuestRoom } from '../../../context/GuestRoomContext';
import toast from 'react-hot-toast';

export const GuestRoomsTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { bookings, updateBookingStatus } = useGuestRoom();

  const filteredBookings = bookings.filter(b => 
    searchQuery === '' || 
    b.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (id: string, action: 'Confirmed' | 'Cancelled') => {
    updateBookingStatus(id, action);
    toast.success(`Booking ${action.toLowerCase()}`);
  };

  const columns = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'guestName', label: 'Guest Name' },
    { key: 'relation', label: 'Relation' },
    { key: 'checkIn', label: 'Check-in', sortable: true },
    { key: 'checkOut', label: 'Check-out', sortable: true },
    { key: 'roomType', label: 'Type' },
    { key: 'total', label: 'Total (₹)', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string, row: any) => {
        if (value === 'Pending') {
          return (
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(row.id, 'Confirmed')}
                className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all"
              >
                Confirm
              </button>
              <button 
                onClick={() => handleAction(row.id, 'Cancelled')}
                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all"
              >
                Cancel
              </button>
            </div>
          );
        }
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
            value === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
            'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {value}
          </span>
        );
      }
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div>
          <h3 className="text-xl  font-bold text-gray-900 dark:text-white">Guest Room Bookings</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage guest room reservations</p>
        </div>
        <CSVExportButton data={filteredBookings} filename="guest_bookings" />
      </div>

      <AdminTable columns={columns} data={filteredBookings} />
    </div>
  );
};
