// lib/api.js
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

export const register = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/register`, data);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_BASE}/api/auth/login`, data);
  return res.data;
};