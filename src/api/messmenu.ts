import client from './client';

export const getWeeklyMenu = (date?: string) =>
  client.get('/api/messmenu/week', { params: { date } }).then(r => r.data);

export const getAllWeeks = () =>
  client.get('/api/messmenu').then(r => r.data);

export const getTodayMenu = () =>
  client.get('/api/messmenu/today').then(r => r.data);

export const upsertWeekMenu = (weekStart: string, days: any[]) =>
  client.put('/api/messmenu/week', { weekStart, days }).then(r => r.data);

export const getVotes = (date: string, studentId?: string) =>
  client.get(`/api/messmenu/votes/${date}`, { params: { studentId } }).then(r => r.data);

export const getWeekVotes = (weekStart: string) =>
  client.get(`/api/messmenu/votes/week/${weekStart}`).then(r => r.data);

export const castVote = (date: string, studentId: string, voteType: 'up' | 'down') =>
  client.post(`/api/messmenu/votes/${date}`, { studentId, voteType }).then(r => r.data);

// legacy compat
export const updateDayMenu = (day: string, data: any) => Promise.resolve(data);
