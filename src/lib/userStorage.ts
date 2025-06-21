// lib/userStorage.ts
'use client'; // Đảm bảo file này chỉ dùng trong client components

export interface User {
  token: string;
  username: string;
  userId: string;
}

const USER_KEY = 'user';

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const user = getUser();
  return !!user?.token;
};
