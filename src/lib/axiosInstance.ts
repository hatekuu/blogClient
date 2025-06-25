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
function isPublicPath(path: string) {
  return (
    path === '/' ||
    path === '/posts' ||
    path === '/auth/login' ||
    path === '/auth/register' ||
   /^\/posts\/(?!new$)[^/]+$/.test(path)

  );
}

instance.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      // ✅ Nếu đang ở trang public (login/register) và token hợp lệ → redirect về "/"
      const isAuthPage = currentPath === '/auth/login' || currentPath === '/auth/register';
      const user = getUser();

      if (user?.token && isAuthPage) {
        window.location.href = '/';
      }
    }

    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message;
    const tokenErrors = ['Token is blacklisted', 'Invalid token', 'No token provided'];

    if (message && tokenErrors.includes(message)) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        if (!isPublicPath(currentPath)) {
          removeUser();
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  }
);



export default instance;
