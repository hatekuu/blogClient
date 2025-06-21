'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { createPost } from '@/lib/api/posts';
import type { Post } from '@/types/post';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

// Loading Spinner Component
// eslint-disable-next-line react/prop-types
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const CreatePostPage: React.FC = () => {
  const [form, setForm] = useState<Pick<Post, 'title' | 'content'>>({
    title: '',
    content: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle image selection and generate previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      // Generate local URLs for image previews
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // Clean up preview URLs to prevent memory leaks
  const revokeImagePreviews = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
  };

  // Upload images to server
  const uploadImages = async () => {
    const urls: string[] = [];
    try {
      for (const file of images) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post<{ url: string }>('/api/upload', formData);
        urls.push(res.data.url);
      }
    } catch {
      throw new Error('Failed to upload images');
    }
    return urls;
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + emojiData.emoji,
    }));
    setShowEmojiPicker(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setMessage('❌ Vui lòng nhập tiêu đề và nội dung!');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const uploadedUrls = images.length > 0 ? await uploadImages() : [];
      const newPost: Pick<Post, 'title' | 'content' | 'img_url_list'> = {
        ...form,
        img_url_list: uploadedUrls,
      };
      await createPost(newPost);
      setMessage('✅ Bài viết đã được tạo!');
      // Reset form
      setForm({ title: '', content: '' });
      setImages([]);
      revokeImagePreviews();
    } catch (err) {
      console.error(err);
      setMessage('❌ Lỗi khi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Tạo bài viết</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            placeholder="Nhập tiêu đề..."
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Content Textarea */}
        <div className="relative">
          <label className="block font-medium text-gray-700">Nội dung</label>
          <textarea
            placeholder="Nhập nội dung... (bấm nút emoji để thêm biểu tượng)"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          {/* Emoji Picker Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute top-10 right-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
            title="Thêm emoji"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute z-10 mt-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Image Upload and Preview */}
        <div>
          <label className="block font-medium text-gray-700">Hình ảnh</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
          />
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {imagePreviews.map((url, index) => (
                <div key={index} className="relative w-full h-32">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-lg shadow-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Đăng bài'}
        </button>

        {/* Message Display */}
        {message && (
          <p className={`text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePostPage;