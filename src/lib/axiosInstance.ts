// lib/axiosInstance.ts
import axios, { AxiosError } from 'axios';
import { getUser, removeUser } from './userStorage';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// ✅ Gắn token vào mỗi request nếu có
instance.interceptors.request.use((config) => {
  const user = getUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ✅ Xử lý lỗi token toàn cục
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message;
    const tokenErrors = ['Token is blacklisted', 'Invalid token', 'No token provided'];

    if (message && tokenErrors.includes(message)) {
      if (typeof window !== 'undefined') {
        removeUser();
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
