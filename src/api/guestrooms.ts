import client from './client';

export const getBookings = (studentId?: string) =>
  client.get('/api/guestrooms', { params: studentId ? { studentId } : {} }).then(r => r.data);

export const createBooking = (data: {
  studentId: string;
  student: string;
  guestName: string;
  relation: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guestsCount: number;
  total: number;
}) => client.post('/api/guestrooms', data).then(r => r.data);

export const updateBookingStatus = (id: string, status: 'Confirmed' | 'Cancelled') =>
  client.patch(`/api/guestrooms/${id}/status`, { status }).then(r => r.data);
