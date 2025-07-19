// src/api/crime.ts
import apiClient from './apiInstance';
import type { Crime } from '../interfaces/crime.interface';

export interface GetCrimesParams {
  cameraId?: string;
  startDate?: string;
  endDate?: string;
  statusId?: string;
  user_id?: number[];
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getCrimes = async (
  params?: GetCrimesParams
): Promise<PaginatedResponse<Crime>> => {
  const { data } = await apiClient.get<PaginatedResponse<Crime>>(
    `crime/`,
    {
      params,
      paramsSerializer: (params) =>
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .flatMap(([key, v]) => {
            if (Array.isArray(v)) {
              return v.map(val =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`
              );
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`;
          })
          .join('&'),
    }
  );
  return data;
};

export const getCrimeDetail = async (id: string): Promise<Crime> => {
  const { data } = await apiClient.get<Crime>(`crime/${id}`);
  return data;
};

export const updateCrimeStatus = async (
  id: string,
  statusId: number,
  description: string
): Promise<void> => {
  await apiClient.patch(`crime/${id}/`, { status_id: statusId, description });
};
