import { signalingInstance } from './signalingInstance';

export const connectCamera = async (cameraName: string, rtspUrl: string) => {
  try {
    const response = await signalingInstance.post('/start-camera/', {
      camera_name: cameraName,
      rtsp_url: rtspUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error al conectar la cámara:', error);
    throw error;
  }
};
