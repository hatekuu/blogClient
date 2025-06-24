// lib/auth.ts
import  axiosInstance from  "../axiosInstance"
import type { AxiosResponse } from 'axios';

const API_BASE = '/api/auth'; // ✅ baseURL đã có trong axiosInstance

export const getProfile = async (): Promise<AxiosResponse['data'] | null> => {
  try {
    const res = await axiosInstance.get(`${API_BASE}/profile`);
    return res.data;
  } catch (error) {
    // ❌ lỗi token đã xử lý ở axiosInstance → chỉ cần trả null ở đây
    return error;
  }
};
