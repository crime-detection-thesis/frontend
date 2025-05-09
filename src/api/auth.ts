import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const registerUser = (email: string, password: string) => {
    return axios.post(`${API_URL}/register`, { email, password });
};

export const loginUser = (email: string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
};
