'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getPostById, updatePost } from '@/lib/api/posts';
import { extractPublicId } from '@/lib/extractImgid';
import axios from 'axios';
import type { Post } from '@/types/post';

// Simple Loading Spinner Component
// eslint-disable-next-line react/prop-types
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgUrlList, setImgUrlList] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For API calls
  const [isUploading, setIsUploading] = useState(false); // For image uploads

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getPostById(id as string);
        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setImgUrlList(data.img_url_list || []);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id && typeof id === 'string') {
      fetch();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadImages = async () => {
    setIsUploading(true);
    const urls: string[] = [];
    try {
      for (const file of images) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post<{ url: string }>('/api/upload', formData);
        urls.push(res.data.url);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
    return urls;
  };

  const handleAddImgField = async () => {
    if (images.length === 0) return;
    const uploadedUrls = await uploadImages();
    setImgUrlList((prev) => [...prev, ...uploadedUrls]);
    setImages([]); // Reset after upload
  };

  const handleRemoveImgField = async (index: number, url: string) => {
    setIsLoading(true);
    try {
      const public_id = extractPublicId(url);
      if (public_id) {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id }),
        });
      }
      const updatedList = imgUrlList.filter((_, i) => i !== index);
      setImgUrlList(updatedList);
    } catch (error) {
      console.error('Error removing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updatePost(id as string, {
        title,
        content,
        img_url_list: imgUrlList.filter((url) => url.trim() !== ''),
      });
      router.push('/posts');
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <span className="ml-4 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Sửa bài viết</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Tiêu đề</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            placeholder="Nhập tiêu đề..."
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            rows={6}
            placeholder="Nhập nội dung..."
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Danh sách ảnh</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {imgUrlList.map((url, index) => (
              <div
                key={index}
                className="relative w-full h-32 group transform transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1} for post titled ${title || 'post'}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-lg shadow-sm"
                  priority={index === 0}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImgField(index, url)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : 'Xóa ảnh'}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
            />
            <button
              type="button"
              onClick={handleAddImgField}
              className="mt-2 text-blue-500 hover:text-blue-700 underline text-sm transition-colors duration-200"
              disabled={isUploading || images.length === 0}
            >
              {isUploading ? <LoadingSpinner /> : 'Upload ảnh'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-200 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : 'Cập nhật'}
        </button>
      </form>
    </div>
  );
}