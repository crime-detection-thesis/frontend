import apiClient from './apiInstance';
import { setTokens, clearTokens } from './tokenService';

export interface RegisterData {
    email: string;
    username: string;
    password: string;
    surveillance_center_id: number;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}

export const registerUser = (data: RegisterData) =>
  apiClient.post('/user/register/', data);

export const loginUser = async (
  email: string,
  password: string
): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>('/user/login/', {
        email,
        password,
    });
    setTokens(data);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
    return data;
};

export const logoutUser = async () => {
    await apiClient.post('/user/logout/');
    clearTokens();
};

