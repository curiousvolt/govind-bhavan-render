import client from './client';

export const requestOtp = (email: string) =>
  client.post('/api/auth/request-otp', { email }).then(r => r.data);

export const verifyOtp = (email: string, otp: string) =>
  client.post('/api/auth/verify-otp', { email, otp }).then(r => r.data);
