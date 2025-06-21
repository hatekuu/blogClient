import axios from 'axios';
import { getUser } from '../userStorage';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/posts';

// ✅ Helper để lấy headers với token
const getAuthHeaders = () => {
  const user = getUser();
  
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const createPost = async (data: {
  title: string;
  content: string;
  img_url_list?: string[];
}) => {
  const res = await axios.post(API_BASE, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getAllPosts = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getPostById = async (id: string) => {
  const check=`${API_BASE}/${id}`
  console.log({check})

  const res = await axios.get(`${API_BASE}/${id}`,{
    headers:getAuthHeaders()
  });
  return res.data;
};

export const updatePost = async (id: string, data: {
  title?: string;
  content?: string;
  img_url_list?: string[];
}) => {
  const res = await axios.put(`${API_BASE}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deletePost = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
