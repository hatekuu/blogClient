// lib/api/posts.ts
import axiosInstance from '../axiosInstance';
import type { CreatePostInput } from '@/types/post';

const API_BASE = '/api/posts'; 

export const createPost = async (data: CreatePostInput) => {
  const res = await axiosInstance.post(API_BASE, data);
  return res.data;
};

export const getAllPosts = async () => {
  const res = await axiosInstance.get(API_BASE);
  return res.data;
};

export const getPostById = async (id: string) => {
  const res = await axiosInstance.get(`${API_BASE}/${id}`);
  return res.data;
};

export const updatePost = async (
  id: string,
  data: { title: string; sections: { content: string; img_url: string }[] }
) => {
  const res = await axiosInstance.put(`${API_BASE}/${id}`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await axiosInstance.delete(`${API_BASE}/${id}`);
  return res.data;
};
