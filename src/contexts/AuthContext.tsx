import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import apiClient from '../api/apiInstance';
import { setTokens, clearTokens, getAccessToken, type JWTPayload } from '../api/tokenService';
import type { RegisterData } from '../interfaces/auth.interface';
import { useNavigate } from 'react-router-dom';
import type { Camera } from '../interfaces/camera.interface';
import Loader from '../components/Loader';

interface AuthContextType {
  userId: number;
  userName: string | null;
  cameras: Camera[];
  isAdmin: boolean;
  setCameras: (cameras: Camera[]) => void;
  surveillanceCenterId: number;
  isInitializing: boolean;
  videoGatewayUrl: string | null;
  setVideoGatewayUrl: (url: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  apiClient: AxiosInstance;
  refreshCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [surveillanceCenterId, setSurveillanceCenterId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [videoGatewayUrl, setVideoGatewayUrl] = useState<string | null>(null);

const refreshCurrentUser = async () => {
    try {
      const { data } = await apiClient.post<{ access: string; refresh?: string }>('/user/token/refresh/');
      setTokens(data);

      const payload = decodeJWT(data.access) || {};
      setUserId(typeof payload.user_id === 'number' ? payload.user_id : null);
      setUserName(typeof payload.username === 'string' ? payload.username : null);
      setSurveillanceCenterId(
        typeof payload.surveillance_center === 'number'
          ? payload.surveillance_center
          : null
      );
      setIsAdmin(typeof payload.is_admin === 'boolean' ? payload.is_admin : false);
      } catch (error) {
      console.error('Error al refrescar usuario tras registro:', error);
    }
  };

  const clearAuth = () => {
    clearTokens();
    setAccessToken(null);
    setUserId(null);
    setUserName(null);
    setSurveillanceCenterId(null);
    setIsAdmin(false);
    setCameras([]);
    setVideoGatewayUrl(null);
  };

  useEffect(() => {
    (async () => {
      const token = getAccessToken();
      if (token) {
        const payload = decodeJWT(token);
        setUserId(payload?.user_id ?? null);
        setUserName(payload?.username ?? null);
        setSurveillanceCenterId(payload?.surveillance_center ?? null);
        setIsAdmin(payload?.is_admin ?? false);
      } else {
        await refreshCurrentUser();
      }
      setIsInitializing(false);
    })();
  }, []);

  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen">
    <Loader />
    </div>
  }

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/user/login/', { email, password });
    setAccessToken(data.access);
    setTokens(data);

    const payload = decodeJWT(data.access);
    setUserId(typeof payload?.user_id === 'number' ? payload.user_id : 0);
    setUserName(typeof payload?.username === 'string' ? payload.username : '');
    setSurveillanceCenterId(
      typeof payload?.surveillance_center === 'number'
        ? payload.surveillance_center
        : 0
    );
    setIsAdmin(typeof payload?.is_admin === 'boolean' ? payload.is_admin : false);

    if (payload?.surveillance_center) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/select-surveillance-center', { replace: true });
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/user/logout/', {});
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      clearAuth();
      navigate('/login', { replace: true });
    }
  };

  const register = async (payload: RegisterData) => {
    try {
      await apiClient.post('/user/register/', payload);
      await login(payload.email, payload.password);
    } catch (error) {
      console.error('Error durante el registro:', error);
      navigate('/register', { replace: true });
      throw error;
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
        isAdmin,
        surveillanceCenterId: surveillanceCenterId ?? 0,
        isInitializing,
        refreshCurrentUser,
        videoGatewayUrl: videoGatewayUrl ?? '',
        setVideoGatewayUrl
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

function decodeJWT(token: string): JWTPayload | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
