'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getPostById, updatePost } from '@/lib/api/posts';
import type { Post } from '@/types/post';
import { extractPublicId } from '@/lib/extractImgid';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Post['sections']>([]);
  const [newImages, setNewImages] = useState<(File | null)[]>([]);
  const [loading, setLoading] = useState(false);
const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostById(id as string);
        setTitle(data.title || '');
        setSections(data.sections || []);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (typeof id === 'string') {
      fetchPost();
    }
  }, [id]);
  useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = ''; // Chrome & Firefox need this for confirmation
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [isDirty]);


  const handleSectionChange = (index: number, field: 'content' | 'img_url', value: string) => {
      setIsDirty(true);

    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleImageChange = (index: number, file: File | null) => {
    setNewImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
        setIsDirty(true);

      return updated;
    });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post<{ url: string }>('/api/upload', formData);
    return res.data.url;
  };
const deleteImage = async (public_id: string) => {
  type DeleteImageResponse = {
  result: 'ok' | 'not found' | string;
};

  const res = await axios.post<{ result: DeleteImageResponse }>('/api/delete-image', {
    public_id,
  });
  return res.data.result;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedSections = await Promise.all(
        sections.map(async (section, i) => {
          if (newImages[i]) {
            const uploadedUrl = await uploadImage(newImages[i]!);
            return { ...section, img_url: uploadedUrl };
          }
          return section;
        })
      );

      await updatePost(id as string, {
        title,
        sections: updatedSections,
      });

      router.push('/posts');
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    setSections([...sections, { img_url: '', content: '' }]);
    setNewImages([...newImages, null]);
  };

  const removeSection = async (index: number) => {
  const updatedSections = [...sections];
  const [removedSection] = updatedSections.splice(index, 1);
  const updatedImages = [...newImages];
  updatedImages.splice(index, 1);

  try {
    const publicId = extractPublicId(removedSection.img_url);
    if (publicId) {
      await deleteImage(publicId);
    } else {
      console.warn('❗ Không thể extract public_id từ URL ảnh');
    }

    // ✅ Cập nhật lại bài viết sau khi xóa section
    await updatePost(id as string, {
      title,
      sections: updatedSections,
    });
  } catch (err) {
    console.error('Image deletion or update failed:', err);
  }

  setSections(updatedSections);
  setNewImages(updatedImages);
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Chỉnh sửa bài viết</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input
            type="text"
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => {
      setTitle(e.target.value);
      setIsDirty(true);
    }}

            required
          />
        </div>

        {sections.map((section, index) => (
          <div key={index} className="space-y-2 border border-gray-200 p-4 rounded-md relative">
            <label className="block font-medium text-gray-700">Nội dung đoạn {index + 1}</label>
            <textarea
              className="w-full p-3 border rounded-md"
              rows={4}
              value={section.content}
              onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">Ảnh đoạn {index + 1}</label>
              {section.img_url && (
                <div className="relative w-full h-48">
                  <Image
                    src={section.img_url}
                    alt={`Image section ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(index, e.target.files?.[0] || null)
                }
                className="block mt-2 text-sm text-gray-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeSection(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
            >
              Xóa đoạn
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="w-full text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50 transition"
        >
          + Thêm đoạn mới
        </button>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Cập nhật bài viết'}
        </button>
      </form>
    </div>
  );
}
