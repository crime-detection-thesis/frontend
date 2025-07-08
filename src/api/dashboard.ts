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

export function getMetrics(): Promise<Metrics> {
  return apiClient.get('/crime/dashboard/metrics/').then(r => r.data);
}

export function getEventsOverTime(days = 7): Promise<Point[]> {
  return apiClient.get(`/crime/dashboard/events-over-time/?days=${days}`)
            .then(r => r.data);
}

export function getEventsByState(): Promise<StateSlice[]> {
  return apiClient.get('/crime/dashboard/events-by-state/').then(r => r.data);
}

export function getEventsByCamera(top = 10): Promise<CameraSlice[]> {
  return apiClient.get(`/crime/dashboard/events-by-camera/?top=${top}`)
            .then(r => r.data);
}
