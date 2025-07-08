import axios from "axios";
import { getAccessToken } from "./tokenService";

const API_URL = `http://${import.meta.env.VITE_SIGNALING_URL}`;

export const signalingInstance = axios.create({
    baseURL: API_URL,
});

// Attach Authorization header with current access token
signalingInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
