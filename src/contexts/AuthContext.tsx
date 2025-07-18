import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { AxiosInstance } from 'axios';
import apiClient from '../api/apiInstance';
import { setTokens, clearTokens } from '../api/tokenService';
import type { RegisterData } from '../interfaces/auth.interface';
import { useNavigate } from 'react-router-dom';
import type { Camera } from '../interfaces/camera.interface';

interface AuthContextType {
  userId: number;
  userName: string | null;
  cameras: Camera[];
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [surveillanceCenterId, setSurveillanceCenterId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.post('/user/token/refresh/');
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
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        clearTokens();
        setAccessToken(null);
        setUserName(null);
      }
    })();
  }, []);

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

    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await apiClient.post('/user/logout/', {});
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      clearTokens();
      setAccessToken(null);
      setUserName(null);
      navigate('/login');
    }
  };

  const register = async (payload: RegisterData) => {
    try {
      await apiClient.post('/user/register/', payload);
      await login(payload.email, payload.password);
    } catch (error) {
      console.error('Error durante el registro:', error);
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
