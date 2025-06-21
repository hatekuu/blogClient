'use client';
import { useState } from 'react';
import { register } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Đăng ký thành công!');
      router.push('/auth/login');
    } catch (err: unknown) {
  const error = err as AxiosError<{ message: string }>;
  alert('Đăng nhập thất bại: ' + error.response?.data?.message);
}

  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Đăng ký</h1>
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Đăng ký</button>
    </form>
  );
}
