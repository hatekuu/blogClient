'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getPostById } from '@/lib/api/posts';
import type { Post } from '@/types/post';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

// Skeleton Loader for Post
// eslint-disable-next-line react/prop-types
const PostSkeleton = () => (
  <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="grid grid-cols-2 gap-2">
      {Array(2).fill(0).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`skeleton-${index}`} className="h-32 bg-gray-200 rounded"></div>
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
    } catch {
      setError(ERROR_MESSAGES.POST_NOT_FOUND);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError(ERROR_MESSAGES.INVALID_ID);
      setLoading(false);
      return;
    }
    fetchPost();
  }, [fetchPost, id]);

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
        <p className="text-red-600">{error || ERROR_MESSAGES.POST_INVALID}</p>
      </div>
    );
  }

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
      {post.sections && post.sections.length > 0 ? (
        <div className="space-y-6">
          {post.sections.map(({ img_url, content }, index) => (
            <div key={index} className="space-y-2">
              <div className="relative w-full h-48">
                <Image
                  src={img_url}
                  alt={`Illustration ${index + 1} for post titled ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-md shadow-sm"
                  priority={index < 2}
                />
              </div>
              <p className="text-gray-700 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Không có nội dung hoặc hình ảnh.</p>
      )}
    </div>
  );
}