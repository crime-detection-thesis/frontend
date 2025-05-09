import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getSurveillanceCenters = () => {
    return axios.get(`${API_URL}/centers`);
};

export const createSurveillanceCenter = (name: string, latitude: string, longitude: string) => {
    return axios.post(`${API_URL}/create-center`, { name, latitude, longitude });
};
