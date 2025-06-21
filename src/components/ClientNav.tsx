'use client';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { getUser } from '@/lib/userStorage';

export default function ClientNav() {
  const user = getUser();

  return (
    <div className="space-x-4">
      <Link href="/posts" className="hover:text-blue-500">Trang chủ</Link>
      <Link href="/posts/new" className="hover:text-blue-500">Tạo bài viết</Link>

      {user?.userId ? (
        <LogoutButton />
      ) : (
        <>
          <Link href="/auth/login" className="hover:text-blue-500">Đăng nhập</Link>
          <Link href="/auth/register" className="hover:text-blue-500">Đăng ký</Link>
        </>
      )}
    </div>
  );
}
