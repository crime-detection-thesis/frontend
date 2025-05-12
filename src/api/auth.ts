// import axios from 'axios';
//
// const API_URL = 'http://localhost:8000/api';
//
// export const registerUser = (email: string, password: string) => {
//     return axios.post(`${API_URL}/register`, { email, password });
// };
//
// export const loginUser = (email: string, password: string) => {
//     return axios.post(`${API_URL}/login`, { email, password });
// };


// src/api/auth.ts
import apiClient from './axiosInstance';
import { setTokens, clearTokens, getRefreshToken } from './tokenService';

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
    const refresh = getRefreshToken();
    if (refresh) {
        await apiClient.post('/user/logout/', { refresh });
    }
    clearTokens();
};

export const refreshToken = async (): Promise<TokenResponse> => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('No refresh token stored');
    const { data } = await apiClient.post<TokenResponse>('/user/token/refresh/', {
        refresh,
    });
    setTokens(data);
    apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`;
    return data;
};

