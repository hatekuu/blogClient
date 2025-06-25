'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { getUser } from '@/lib/userStorage';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { getProfile } from '@/lib/api/auth';
export default function ClientNav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
   getUserProfile();
  }, []);
  const getUserProfile =async()=>{
    await getProfile()
  }
  return (
    <div className="space-x-4">
      <Link href="/posts" className="hover:text-blue-500">Trang chủ</Link>
     

      {user?.userId ? (
        <>   <Link href="/posts/new" className="hover:text-blue-500">Tạo bài viết</Link>
         <LogoutButton /></>
       
      ) : (
        <>
      
          <Link href="/auth/login" className="hover:text-blue-500">Đăng nhập</Link>
          <Link href="/auth/register" className="hover:text-blue-500">Đăng ký</Link>
        </>
      )}
    </div>
  );
}
