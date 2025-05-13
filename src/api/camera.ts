import axiosInstance from './axiosInstance';

export const connectCamera = async (cameraName: string, rtspUrl: string) => {
  try {
    const response = await axiosInstance.post('camera/connect-camera/', {
      cameraName,
      rtspUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error al conectar la cámara:', error);
    throw error;
  }
};
