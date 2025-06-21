// import axios from 'axios';
// import {
//   getAccessToken,
//   getRefreshToken,
//   setTokens,
//   clearTokens,
// } from './tokenService';
//
// const API_URL = 'http://localhost:8000/api';
//
// const apiClient = axios.create({
//   baseURL: API_URL,
// });
//
// // Añade el access token a cada petición
// apiClient.interceptors.request.use(cfg => {
//   const token = getAccessToken();
//   if (token && cfg.headers) {
//     cfg.headers.Authorization = `Bearer ${token}`;
//   }
//   return cfg;
// });
//
// // Manejo reactivo de 401
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (err: any) => void;
// }> = [];
//
// const processQueue = (err: any, token: string | null = null) => {
//   failedQueue.forEach(p => {
//     if (err) p.reject(err);
//     else p.resolve(token!);
//   });
//   failedQueue = [];
// };
//
// apiClient.interceptors.response.use(
//   res => res,
//   err => {
//     const { config, response } = err;
//     if (
//       response?.status === 401 &&
//       !config._retry &&
//       !config.url!.endsWith('/user/login/')
//     ) {
//       config._retry = true;
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           config.headers.Authorization = `Bearer ${token}`;
//           return apiClient(config);
//         });
//       }
//
//       isRefreshing = true;
//       const refresh = getRefreshToken();
//       if (!refresh) {
//         clearTokens();
//         window.location.href = '/login';
//         return Promise.reject(err);
//       }
//
//       return new Promise((resolve, reject) => {
//         axios
//           .post(`${API_URL}/user/token/refresh/`, { refresh })
//           .then(({ data }) => {
//             setTokens(data);
//             apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`;
//             processQueue(null, data.access);
//             config.headers.Authorization = `Bearer ${data.access}`;
//             resolve(apiClient(config));
//           })
//           .catch(error => {
//             processQueue(error, null);
//             clearTokens();
//             window.location.href = '/login';
//             reject(error);
//           })
//           .finally(() => {
//             isRefreshing = false;
//           });
//       });
//     }
//
//     return Promise.reject(err);
//   }
// );
//
// export default apiClient;




// src/api/axiosInstance.ts
import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenService';

// Extiende la interfaz para permitir _retry
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// const API_URL = 'http://localhost:8000/api';
// const API_URL = 'http://backend:8000/api';
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Rutas que NUNCA deben disparar el flujo de refresh
const SKIP_URLS = [
  '/user/login/',
  '/user/register/',
  '/user/token/refresh/',
  '/user/logout/'
];

const apiClient = axios.create({
  baseURL: API_URL,
});

// 1) Request interceptor: añade el access token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2) Response interceptor: maneja 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config!;
    const status = error.response?.status;
    const requestUrl = originalRequest.url || '';

    // Si no es 401, o ya reintentamos, o es una URL que saltamos, devolvemos el error
    if (
      status !== 401 ||
      originalRequest._retry ||
      SKIP_URLS.some(u => requestUrl.endsWith(u))
    ) {
      return Promise.reject(error);
    }

    // Marcamos que ya estamos reintentando esta petición
    originalRequest._retry = true;

    if (isRefreshing) {
      // Si ya estamos refrescando, encolamos la petición
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers!['Authorization'] = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    // Iniciamos refresh
    isRefreshing = true;
    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Usamos un cliente limpio para el refresh
      const { data } = await axios.post(
        `${API_URL}/user/token/refresh/`,
        { refresh },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Guardamos nuevos tokens
      setTokens(data);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      processQueue(null, data.access);

      // Reintentamos la petición original
      originalRequest.headers!['Authorization'] = `Bearer ${data.access}`;
      return apiClient(originalRequest);
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
