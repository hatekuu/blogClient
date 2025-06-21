// lib/userStorage.ts

export interface User {
  token: string;
  username: string;
  userId: string;
}

const USER_KEY = 'user';

export const setUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
 
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  const user = getUser();
  return !!user?.token;
};
