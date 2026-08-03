import { env } from '@/config/env';
import axios from 'axios';

const apiService = axios.create({
  baseURL: env.apiUrl,
});

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(`[${status}] ${message}`));
  },
);

export { apiService };
