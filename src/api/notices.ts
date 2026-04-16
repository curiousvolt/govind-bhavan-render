import client from './client';

export const getNotices = () =>
  client.get('/api/notices').then(r => r.data);

export const createNotice = (data: { title: string; category: string; description: string; pinned: boolean }) =>
  client.post('/api/notices', data).then(r => r.data);

export const updateNotice = (id: string, data: Partial<{ title: string; category: string; description: string; pinned: boolean }>) =>
  client.patch(`/api/notices/${id}`, data).then(r => r.data);

export const deleteNotice = (id: string) =>
  client.delete(`/api/notices/${id}`).then(r => r.data);
