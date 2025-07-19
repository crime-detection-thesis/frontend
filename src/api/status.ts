import apiClient from './apiInstance';

export interface Status {
  id: number;
  name: string;
}

export const getStatuses = async (): Promise<Status[]> => {
  const { data } = await apiClient.get<Status[]>('crime/statuses');
  return data;
};
