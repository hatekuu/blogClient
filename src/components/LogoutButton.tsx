'use client';
import axios from 'axios';
import { getUser,removeUser } from '@/lib/userStorage';
export default function LogoutButton() {

  const handleLogout = async () => {
    const user = getUser();
    const token=user?.token
    if (!token) {
      alert("Đã đăng xuất")
    }

    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    removeUser()
    window.location.href='/auth/login';
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Đăng xuất
    </button>
  );
}
