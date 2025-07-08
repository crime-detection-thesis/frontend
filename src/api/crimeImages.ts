import { apiClient } from './apiInstance';

export interface CrimeImageUpdate {
  id: number;
  status_id: number;
  description: string;
}


export interface CrimeImage {
  id: string;
  image_url: string;
  detections: {
    box: number[];
    label: string;
    confidence: number;
  }[];
  description: string;
  time: string;
  status_id: number;
}

export const getCrimeImageDetail = async (
  id: string
): Promise<CrimeImage> => {
  const { data } = await apiClient.get<CrimeImage>(
    `/crime/${id}/images`
  );
  return data;
};

export const updateCrimeImages = async (
  updates: CrimeImageUpdate[]
): Promise<void> => {
  await apiClient.patch(`/crime/update-images/`, updates);
};
