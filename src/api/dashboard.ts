import apiClient from './apiInstance';
import { serializeUserIds } from './user';

export interface Metrics {
  total_cameras: number;
  active_cameras: number;
  total_events: number;
  pending_events: number;
  confirmed_events: number;
  false_positives: number;
}

export interface Point { date: string; count: number; }
export interface StateSlice { state: string; count: number; }
export interface CameraSlice { camera: string; count: number; }

export function getMetrics(
  userIds: number[] = []
): Promise<Metrics> {
  const qs = serializeUserIds(userIds, '?');
  return apiClient.get<Metrics>(`/crime/dashboard/metrics/${qs}`)
                  .then(r => r.data);
}

export function getEventsOverTime(
  days = 7,
  userIds: number[] = []
): Promise<Point[]> {
  const qs = `?days=${days}` + serializeUserIds(userIds, '&');
  return apiClient.get<Point[]>(`/crime/dashboard/events-over-time/${qs}`)
                  .then(r => r.data);
}

export function getEventsByState(
  userIds: number[] = []
): Promise<StateSlice[]> {
  const qs = serializeUserIds(userIds, '?');
  return apiClient.get<StateSlice[]>(`/crime/dashboard/events-by-state/${qs}`)
                  .then(r => r.data);
}

export function getEventsByCamera(
  top = 10,
  userIds: number[] = []
): Promise<CameraSlice[]> {
  const qs = `?top=${top}` + serializeUserIds(userIds, '&');
  return apiClient.get<CameraSlice[]>(`/crime/dashboard/events-by-camera/${qs}`)
                  .then(r => r.data);
}
