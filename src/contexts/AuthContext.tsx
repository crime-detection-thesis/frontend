// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { setTokens, clearTokens } from '../api/tokenService';
import { scheduleTokenRefresh } from '../api/scheduleRefresh';
import type { RegisterData } from '../interfaces/auth.interface';
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { Camera } from '../interfaces/camera.interface';

interface AuthContextType {
  userId: number;
  userName: string | null;
  cameras: Camera[];
  setCameras: (cameras: Camera[]) => void;
  surveillanceCenterId: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  apiClient: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [surveillanceCenterId, setSurveillanceCenterId] = useState<number | null>(null);
  const navigate = useNavigate();

  const apiClient = axios.create({ baseURL:  `${import.meta.env.VITE_API_URL}/api` });
  apiClient.defaults.withCredentials = true;

  apiClient.interceptors.request.use(cfg => {
    if (accessToken && cfg.headers) {
      cfg.headers.Authorization = `Bearer ${accessToken}`;
    }
    return cfg;
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
  }> = [];
  const processQueue = (err: unknown, token: string | null = null) => {
    failedQueue.forEach(p => {
      if (err) {
        p.reject(err);
      } else {
        p.resolve(token!);
      }
    });
    failedQueue = [];
  };

  apiClient.interceptors.response.use(
    res => res,
    (error: AxiosError) => {
      const originalRequest = error.config!;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers!['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          });
        }

        isRefreshing = true;
        return new Promise((resolve, reject) => {
          apiClient.post('/user/token/refresh/', {})
            .then(({ data }) => {
              setAccessToken(data.access);
  setTokens(data);
  scheduleTokenRefresh();

              const payload = decodeJWT(data.access);
              setUserId(typeof payload?.user_id === 'number' ? payload.user_id : 0);
              setUserName(typeof payload?.username === 'string' ? payload.username : '');
              setSurveillanceCenterId(typeof payload?.surveillance_center === 'number' ? payload.surveillance_center : 0);

              processQueue(null, data.access);
              originalRequest.headers!['Authorization'] = `Bearer ${data.access}`;
              resolve(apiClient(originalRequest));
            })
            .catch(err => {
              processQueue(err, null);
              logout();
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.post('/user/token/refresh/', {});
        setAccessToken(data.access);
  setTokens(data);
  scheduleTokenRefresh();
        const payload = decodeJWT(data.access);
        console.log(payload);
        setUserId(typeof payload?.user_id === 'number' ? payload.user_id : 0);
        setUserName(typeof payload?.username === 'string' ? payload.username : '');
        setSurveillanceCenterId(typeof payload?.surveillance_center === 'number' ? payload.surveillance_center : 0);
      } catch {
        setAccessToken(null);
        setUserName('');
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/user/login/', { email, password });
    setAccessToken(data.access);
  setTokens(data);
  scheduleTokenRefresh();

    const payload = decodeJWT(data.access);
    console.log(payload);
    setUserId(typeof payload?.user_id === 'number' ? payload.user_id : 0);
    setUserName(typeof payload?.username === 'string' ? payload.username : '');
    setSurveillanceCenterId(typeof payload?.surveillance_center === 'number' ? payload.surveillance_center : 0);

    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await apiClient.post('/user/logout/', {});
    } catch {
      /* ignore */
    } finally {
      clearTokens();
      setAccessToken(null);
      setUserName('');
      navigate('/login');
    }
  };

  const register = async (payload: RegisterData) => {
    try {
      await apiClient.post('/user/register/', payload);
      // Después de registrar, hacer login automáticamente
      await login(payload.email, payload.password);
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado por el componente que llama
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        userId: userId ?? 0,
        userName, 
        login, 
        logout, 
        register, 
        apiClient, 
        cameras, 
        setCameras,
        surveillanceCenterId: surveillanceCenterId ?? 0
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
