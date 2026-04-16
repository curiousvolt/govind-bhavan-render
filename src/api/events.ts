import client from './client';

export const getEvents = () =>
  client.get('/api/events').then(r => r.data);

export const createEvent = (data: {
  title: string;
  date: string;
  category: string;
  maxRegistrations: number;
}) => client.post('/api/events', data).then(r => r.data);

export const updateEvent = (id: string, data: Partial<{
  title: string;
  date: string;
  category: string;
  maxRegistrations: number;
}>) => client.patch(`/api/events/${id}`, data).then(r => r.data);

export const toggleRegistration = (eventId: string, studentId: string) =>
  client.post(`/api/events/${eventId}/register`, { studentId }).then(r => r.data);
