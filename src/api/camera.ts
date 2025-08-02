import { signalingInstance } from './signalingInstance';
import apiClient from './apiInstance';
import type { CreateCamera } from '../interfaces/camera.interface';

export const getCameras = async () => {
  try {
    const response = await apiClient.get('/camera/');
    return response.data;
  } catch (error) {
    console.error('Error al listar las cámaras:', error);
    throw error;
  }
};

export const listActive = async () => {
  try {
    const response = await apiClient.get('/camera/active');
    return response.data;
  } catch (error) {
    console.error('Error al listar las cámaras:', error);
    throw error;
  }
};

export const listInactive = async () => {
  try {
    const response = await apiClient.get('/camera/inactive');
    return response.data;
  } catch (error) {
    console.error('Error al listar las cámaras:', error);
    throw error;
  }
};

export const create = async (camera: CreateCamera) => {
  try {
    const response = await apiClient.post('/camera/', {
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      surveillance_center: camera.surveillance_center,
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la cámara:', error);
    throw error;
  }
};

export const connect = async (videoGatewayUrl: string, cameraId: number, rtspUrl: string) => {
  try {
    const response = await signalingInstance.post('/start-camera', {
      video_gateway_url: videoGatewayUrl,
      camera_id: cameraId,
      rtsp_url: rtspUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error al conectar la cámara:', error);
    throw error;
  }
};

export const changeActive = async (cameraId: number, active: boolean) => {
  try {
    const response = await apiClient.patch(`/camera/${cameraId}/change-active/`, {
      active: active
    });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el estado de la cámara:', error);
    throw error;
  }
};


