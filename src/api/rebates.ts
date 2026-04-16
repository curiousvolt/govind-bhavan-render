import client from './client';

export const getRebates = (studentId?: string) =>
  client.get('/api/rebates', { params: studentId ? { studentId } : {} }).then(r => r.data);

export const createRebate = (data: {
  studentId: string;
  student: string;
  room: string;
  fromDate: string;
  toDate: string;
  reason: string;
}) => client.post('/api/rebates', data).then(r => r.data);

export const updateRebateStatus = (id: string, status: 'Approved' | 'Rejected') =>
  client.patch(`/api/rebates/${id}/status`, { status }).then(r => r.data);
