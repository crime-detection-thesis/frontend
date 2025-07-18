import apiClient from './apiInstance';

export interface Center {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export const getSurveillanceCenters = () =>
  apiClient.get<Center[]>('/surveillance/');

export const createSurveillanceCenter = (name: string, latitude: number, longitude: number) =>
  apiClient.post<Center>('/surveillance/', { name, latitude, longitude });
