// src/api/crime.ts
import { apiClient } from './apiInstance';
import type { Crime } from '../interfaces/crime.interface';

export interface GetCrimesParams {
  cameraId?: string;
  startDate?: string;
  endDate?: string;
  statusId?: string;
  // --- nuevos para paginación ---
  page?: number;
  page_size?: number;
}

/** Forma estándar de respuesta paginada en DRF */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Obtiene crímenes, ahora paginados.
 * Devuelve { count, next, previous, results } en lugar de solo array.
 */
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
          .map(
            ([key, v]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(v as string)}`
          )
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
