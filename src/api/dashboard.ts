import { apiClient } from './apiInstance';

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

export function getMetrics(surveillance_center_id: number): Promise<Metrics> {
  return apiClient.get(`/crime/dashboard/metrics/?surveillance_center_id=${surveillance_center_id}`).then(r => r.data);
}

export function getEventsOverTime(surveillance_center_id: number, days = 7): Promise<Point[]> {
  return apiClient.get(`/crime/dashboard/events-over-time/?surveillance_center_id=${surveillance_center_id}&days=${days}`).then(r => r.data);
}

export function getEventsByState(surveillance_center_id: number): Promise<StateSlice[]> {
  return apiClient.get(`/crime/dashboard/events-by-state/?surveillance_center_id=${surveillance_center_id}`).then(r => r.data);
}

export function getEventsByCamera(surveillance_center_id: number, top = 10): Promise<CameraSlice[]> {
  return apiClient.get(`/crime/dashboard/events-by-camera/?surveillance_center_id=${surveillance_center_id}&top=${top}`).then(r => r.data);
}
