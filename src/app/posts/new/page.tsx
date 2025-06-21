'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { createPost } from '@/lib/api/posts';
import type { CreatePostInput } from '@/types/post';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

interface SectionForm {
  content: string;
  imgFile?: File;
  preview?: string;
}

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<SectionForm[]>([
    { content: '', imgFile: undefined },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  const handleImageChange = (index: number, file: File) => {
    const preview = URL.createObjectURL(file);
    const updatedSections = [...sections];
    updatedSections[index].imgFile = file;
    updatedSections[index].preview = preview;
    setSections(updatedSections);
  };

  const handleContentChange = (index: number, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index].content = value;
    setSections(updatedSections);
  };

  const handleEmojiClick = (emojiData: EmojiClickData, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].content += emojiData.emoji;
    setSections(updatedSections);
    setShowEmojiPicker(null);
  };

  const addSection = () => {
    setSections([...sections, { content: '' }]);
  };

  const removeSection = (index: number) => {
    const updated = [...sections];
    const removed = updated.splice(index, 1);
    if (removed[0]?.preview) URL.revokeObjectURL(removed[0].preview);
    setSections(updated);
  };

  const uploadImages = async () => {
    const urls: string[] = [];
    for (const section of sections) {
      if (section.imgFile) {
        const formData = new FormData();
        formData.append('file', section.imgFile);
        const res = await axios.post<{ url: string }>('/api/upload', formData);
        urls.push(res.data.url);
      } else {
        urls.push('');
      }
    }
    return urls;
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim() || sections.length === 0 || sections.some(s => !s.content.trim())) {
    setMessage('❌ Vui lòng nhập tiêu đề và nội dung cho từng phần!');
    return;
  }

  setLoading(true);
  setMessage('');

  try {
    const imgUrls = await uploadImages();

    const finalSections = sections.map((section, idx) => ({
      content: section.content,
      img_url: imgUrls[idx] || '',
    }));

    const newPost: CreatePostInput = {
      title,
      sections: finalSections,
    };

    await createPost(newPost);

    setTitle('');
    setSections([{ content: '' }]);
    setMessage('✅ Bài viết đã được tạo!');
  } catch (err) {
    console.error(err);
    setMessage('❌ Lỗi khi tạo bài viết');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Tạo bài viết</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            placeholder="Nhập tiêu đề..."
            className="w-full p-3 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {sections.map((section, index) => (
          <div key={index} className="border p-4 rounded-md relative bg-gray-50">
            <label className="block font-medium text-gray-700">Nội dung phần {index + 1}</label>
            <textarea
              placeholder="Nhập nội dung..."
              className="w-full p-2 border rounded-md mb-2"
              value={section.content}
              onChange={(e) => handleContentChange(index, e.target.value)}
              required
              rows={4}
            />

            <button
              type="button"
              onClick={() => setShowEmojiPicker(showEmojiPicker === index ? null : index)}
              className="text-xl absolute top-4 right-4 text-gray-500 hover:text-blue-500"
              title="Thêm emoji"
            >
              😊
            </button>
            {showEmojiPicker === index && (
              <div className="absolute z-10 mt-2">
                <EmojiPicker onEmojiClick={(e) => handleEmojiClick(e, index)} />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageChange(index, e.target.files[0])
              }
              className="block w-full mt-2 text-sm text-gray-500 file:bg-blue-50 file:text-blue-700"
            />

            {section.preview && (
              <div className="relative w-full h-48 mt-2">
                <Image
                  src={section.preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}

            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="text-sm text-red-500 mt-2 hover:underline"
              >
                Xoá phần này
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="w-full text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-all"
        >
          + Thêm phần mới
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Đăng bài'}
        </button>

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
