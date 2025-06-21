'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getPostById } from '@/lib/api/posts';
import type { Post } from '@/types/post';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Skeleton Loader for Post
const PostSkeleton = () => (
  <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="grid grid-cols-2 gap-2">
      {Array(2).fill(0).map((_, index) => (
        <div key={index} className="h-32 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post with memoization
  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPostById(id as string);
      if (!data) {
        throw new Error('Post not found');
      }
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PostSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-red-600">{error || 'Bài viết không tồn tại.'}</p>
      </div>
    );
  }

  const postId = typeof post._id === 'string' ? post._id : post._id.$oid;
  const createdDate = new Date(
    typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.$date
  ).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-400 mb-4">
        Tác giả: <span className="font-medium">{post.author?.username || 'Không rõ'}</span> | Ngày
        tạo: {createdDate}
      </p>
      <p className="text-gray-700 mb-6 leading-relaxed">{post.content}</p>
      {post.img_url_list?.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {post.img_url_list.map((url, index) => (
            <div key={index} className="relative w-full h-48">
              <Image
                src={url}
                alt={`Image ${index + 1} for ${post.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-md shadow-sm"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}