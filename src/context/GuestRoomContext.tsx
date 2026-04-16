import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as guestroomApi from '../api/guestrooms';
import { useAuth } from './AuthContext';

export interface GuestBooking {
  _id?: string;
  id: string;
  studentId?: string;
  student: string;
  guestName: string;
  relation: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guestsCount: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  submittedOn: string;
}

interface GuestRoomContextType {
  bookings: GuestBooking[];
  addBooking: (booking: Omit<GuestBooking, 'id' | '_id' | 'status' | 'submittedOn'>) => Promise<void>;
  updateBookingStatus: (id: string, status: 'Confirmed' | 'Cancelled') => Promise<void>;
}

const GuestRoomContext = createContext<GuestRoomContextType | undefined>(undefined);

const normalize = (b: any): GuestBooking => ({ ...b, id: b._id || b.id });

export const GuestRoomProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const { user, role } = useAuth();

  useEffect(() => {
    if (!user) { setBookings([]); return; }
    const studentId = role === 'student' && user?._id ? user._id : undefined;
    guestroomApi.getBookings(studentId).then(data => setBookings(data.map(normalize))).catch(console.error);
  }, [user]);

  const addBooking = async (bookingData: Omit<GuestBooking, 'id' | '_id' | 'status' | 'submittedOn'>) => {
    const created = await guestroomApi.createBooking({
      studentId: bookingData.studentId || user?._id,
      student: bookingData.student,
      guestName: bookingData.guestName,
      relation: bookingData.relation,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      roomType: bookingData.roomType,
      guestsCount: bookingData.guestsCount,
      total: bookingData.total,
    });
    setBookings(prev => [normalize(created), ...prev]);
  };

  const updateBookingStatus = async (id: string, status: 'Confirmed' | 'Cancelled') => {
    const updated = await guestroomApi.updateBookingStatus(id, status);
    setBookings(prev => prev.map(b => (b._id === id || b.id === id) ? normalize(updated) : b));
  };

  return (
    <GuestRoomContext.Provider value={{ bookings, addBooking, updateBookingStatus }}>
      {children}
    </GuestRoomContext.Provider>
  );
};

export const useGuestRoom = () => {
  const context = useContext(GuestRoomContext);
  if (context === undefined) throw new Error('useGuestRoom must be used within a GuestRoomProvider');
  return context;
};
