// lib/userStorage.ts
'use client'; // Đảm bảo file này chỉ dùng trong client components

import { User } from "@/types/user";

const USER_KEY = 'user';

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) as User : null;
  } catch  {
    return null;
  }
}

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
