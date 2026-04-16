import client from './client';

export const getStudents = (params?: { search?: string; page?: number; limit?: number }) =>
  client.get('/api/students', { params }).then(r => r.data);

export const getStudentProfile = (id: string) =>
  client.get(`/api/students/${id}/profile`).then(r => r.data);

export const updateStudent = (id: string, data: any) =>
  client.patch(`/api/students/${id}`, data).then(r => r.data);

export const getAllStudents = () =>
  client.get('/api/students', { params: { limit: 1000 } }).then(r => r.data.students || r.data);
