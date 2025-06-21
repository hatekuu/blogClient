'use client';

import Link from 'next/link';
import { getUser } from '@/lib/userStorage';
console.log(getUser())
export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Chào mừng đến với BlogApp! 📝</h1>
      <p className="text-gray-700 mb-6">
        Đây là một nền tảng viết blog đơn giản nơi bạn có thể chia sẻ suy nghĩ, hình ảnh, và câu chuyện của mình.
      </p>
      <div className="flex space-x-4">
        <Link href="/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Tạo bài viết mới
        </Link>
        <Link href="/posts" className="bg-gray-100 text-blue-600 px-4 py-2 rounded hover:bg-gray-200">
          Xem tất cả bài viết
        </Link>
      </div>
    </div>
  );
}
