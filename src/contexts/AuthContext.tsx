// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  userName: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  apiClient: AxiosInstance;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  surveillance_center_id: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Creamos un Axios instance que usará el context
  const apiClient = axios.create({ baseURL: 'http://localhost:8000/api' });
  // Siempre enviar cookies (para el refresh token)
  apiClient.defaults.withCredentials = true;

  // === RQ: Adjuntar el access token desde el state ===
  apiClient.interceptors.request.use(cfg => {
    if (accessToken && cfg.headers) {
      cfg.headers.Authorization = `Bearer ${accessToken}`;
    }
    return cfg;
  });

  // === RQ: Manejo 401 con refresh automático ===
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
        // Llamamos al endpoint de refresh; la cookie HttpOnly se envía automáticamente
        return new Promise((resolve, reject) => {
          axios
            .post(
              'http://localhost:8000/api/user/token/refresh/',
              {},
              { withCredentials: true }
            )
            .then(({ data }) => {
              setAccessToken(data.access);
              // setUserName(data.username); // si lo envías en el payload

              const payload = decodeJWT(data.access);
              setUserName(typeof payload?.username === 'string' ? payload.username : null);

              processQueue(null, data.access);
              originalRequest.headers!['Authorization'] = `Bearer ${data.access}`;
              resolve(apiClient(originalRequest));
            })
            .catch(err => {
              processQueue(err, null);
              logout(); // inmediate logout on refresh failure
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

  // === RQ: Al montar, intentamos un refresh inmediato ===
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await axios.post(
  //         'http://localhost:8000/api/user/token/refresh/',
  //         {},
  //         { withCredentials: true }
  //       );
  //       // setAccessToken(data.access);
  //       // setUserName(data.username);
  //
  //       setAccessToken(data.access);
  //       const payload = decodeJWT(data.access);
  //       setUserName(payload?.username ?? null);
  //     } catch {
  //       setAccessToken(null);
  //       setUserName(null);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          'http://localhost:8000/api/user/token/refresh/',
          {},
          { withCredentials: true }
        );
        setAccessToken(data.access);
        const payload = decodeJWT(data.access);
        setUserName(typeof payload?.username === 'string' ? payload.username : null);
      } catch {
        // **silence**, no console.error
        setAccessToken(null);
        setUserName(null);
      }
    })();
  }, []);

  // === Métodos de Auth ===
  // const login = async (email: string, password: string) => {
  //   const { data } = await axios.post(
  //     'http://localhost:8000/api/user/login/',
  //     { email, password },
  //     { withCredentials: true }
  //   );
  //   setAccessToken(data.access);
  //   setUserName(data.username);
  //   navigate('/dashboard');
  // };

  const login = async (email: string, password: string) => {
    const { data } = await axios.post(
      'http://localhost:8000/api/user/login/',
      { email, password },
      { withCredentials: true }
    );
    setAccessToken(data.access);

    // Decodifica y saca username
    const payload = decodeJWT(data.access);
    setUserName(typeof payload?.username === 'string' ? payload.username : null);

    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await apiClient.post('/user/logout/', {});
    } catch {
      /* ignore */
    } finally {
      setAccessToken(null);
      setUserName(null);
      navigate('/login');
    }
  };

  const register = async (payload: RegisterData) => {
    // Registra usuario; backend en response de register no devuelve tokens
    await apiClient.post('/user/register/', payload);
    // luego login automático
    await login(payload.email, payload.password);
  };

  return (
    <AuthContext.Provider
      value={{ userName, login, logout, register, apiClient }}
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
