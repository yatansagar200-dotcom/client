import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const login = (email, password) => {
  return axios.post(`${API_BASE}/api/auth/login`, { email, password });
};
