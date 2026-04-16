import client from './client';

export const getComplaints = (studentId?: string, category?: string, status?: string) =>
  client.get('/api/complaints', { params: { studentId, category, status } }).then(r => r.data);

export const createComplaint = (data: any) =>
  client.post('/api/complaints', data).then(r => r.data);

export const updateComplaintStatus = (id: string, status: string) =>
  client.patch(`/api/complaints/${id}/status`, { status }).then(r => r.data);
