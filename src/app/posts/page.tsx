'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, deletePost } from '@/lib/api/posts';
import { extractPublicId } from '@/lib/extractImgid';
import { getUser } from '@/lib/userStorage';
import type { Post } from '@/types/post';
import type { User } from '@/types/user';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Skeleton Loader for Posts
const PostSkeleton = () => (
  <li className="bg-white shadow p-4 rounded animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </li>
);

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts with memoization
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle post deletion
  const handleDelete = async (id: string, imageUrls: string[] = []) => {
    if (!confirm('Xác nhận xóa bài viết?')) return;

    setDeletingPostId(id);
    try {
      await deletePost(id);

      // Delete associated images
      await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const public_id = extractPublicId(imageUrl);
          if (public_id) {
            await fetch('/api/delete-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_id }),
            });
          }
        })
      );

      await fetchPosts();
    } catch (err) {
      console.error('Xóa bài viết thất bại:', err);
      setError('Không thể xóa bài viết. Vui lòng thử lại.');
    } finally {
      setDeletingPostId(null);
    }
  };

  // Initialize user and fetch posts
  useEffect(() => {
    const storedUser = getUser();
    setUser(storedUser);
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách bài viết</h1>
        <Link
          href="/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
        >
          + Tạo bài viết
        </Link>
      </div>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      {loading ? (
        <ul className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </ul>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600">Chưa có bài viết nào. Hãy tạo bài viết mới!</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => {
            const postId = typeof post._id === 'string' ? post._id : post._id.$oid;
            const createdDate = new Date(
              typeof post.createdAt === 'string' ? post.createdAt : post.createdAt.$date
            ).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            const imageUrls = post.img_url_list || [];

            return (
              <li
                key={postId}
                className="bg-white shadow-md p-4 rounded-lg transform transition-all duration-200 hover:shadow-lg"
              >
                {imageUrls.length > 0 && (
                  <div className="relative mb-4">
                    <Image
                      src={imageUrls[0]}
                      alt={post.title}
                      width={800}
                      height={192}
                      className="w-full h-48 object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={posts.indexOf(post) < 2}
                    />
                    {imageUrls.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{imageUrls.length - 1} ảnh
                      </span>
                    )}
                  </div>
                )}

                <Link href={`/posts/${postId}`}>
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {post.content.slice(0, 100)}...
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Tác giả:{' '}
                  <span className="font-medium">{post.author?.username || 'Không rõ'}</span> | Ngày
                  tạo: {createdDate}
                </p>

                {user?.userId === post.author?.id && (
                  <div className="mt-3 flex space-x-4">
                    <Link
                      href={`/posts/edit/${postId}`}
                      className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(postId, imageUrls)}
                      className="text-red-500 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                      disabled={deletingPostId === postId}
                    >
                      {deletingPostId === postId ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Đang xóa...</span>
                        </>
                      ) : (
                        'Xóa'
                      )}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}