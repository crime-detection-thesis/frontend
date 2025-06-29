import axios from "axios";

const API_URL = `http://${import.meta.env.VITE_SIGNALING_URL}`;

export const signalingInstance = axios.create({
    baseURL: API_URL,
});
