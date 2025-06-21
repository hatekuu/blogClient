'use client';
import { useState } from 'react';
import { login } from '@/lib/api';

import { setUser } from '@/lib/userStorage';
export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '',userId:'' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token, username,userId } = await login(form);
   setUser({
  token: token,
  username: username,
  userId: userId,
});
      window.location.href="/"
    } catch (err) {
      alert('Đăng nhập thất bại: ' + err?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Đăng nhập</h1>
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Đăng nhập</button>
    </form>
  );
}
