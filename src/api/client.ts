import axios from 'axios';

const client = axios.create({
  baseURL: '',  // uses Vite proxy: /api/* → localhost:5000/api/*
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  if (userStr) {
    const user = JSON.parse(userStr);
    config.headers['x-user-id'] = user._id;
  }
  if (role) {
    config.headers['x-user-role'] = role;
  }
  return config;
});

export default client;
