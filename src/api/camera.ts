import axiosInstance from './axiosInstance';

export const addCamera = async (cameraName: string, rtspUrl: string) => {
  try {
    const response = await axiosInstance.post('camera', {
      cameraName,
      rtspUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error al conectar la cámara:', error);
    throw error;
  }
};
