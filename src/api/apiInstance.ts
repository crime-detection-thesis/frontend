import axios, { AxiosError } from 'axios';
import {
  getAccessToken,
  setTokens,
  clearTokens,
} from './tokenService';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const SKIP_URLS = [
  '/user/login/',
  '/user/register/',
  '/user/token/refresh/',
];

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(cfg => {
  const token = getAccessToken();
  if (token && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (err: unknown, token: string | null = null) => {
  failedQueue.forEach(p => err ? p.reject(err) : p.resolve(token!));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalReq = error.config!;
    const status = error.response?.status;
    const url = originalReq.url || '';

    if (
      status !== 401 ||
      originalReq._retry ||
      SKIP_URLS.some(u => url.endsWith(u))
    ) {
      return Promise.reject(error);
    }
    originalReq._retry = true;

    if (isRefreshing) {
      return new Promise<string>((res, rej) => {
        failedQueue.push({ resolve: res, reject: rej });
      })
      .then(token => {
        originalReq.headers!['Authorization'] = `Bearer ${token}`;
        return apiClient(originalReq);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await apiClient.post('/user/token/refresh/');
      setTokens(data);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      processQueue(null, data.access);

      originalReq.headers!['Authorization'] = `Bearer ${data.access}`;
      return apiClient(originalReq);
    } catch (err2) {
      processQueue(err2, null);
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(err2);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
