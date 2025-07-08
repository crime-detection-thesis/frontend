import React, { useEffect, useState, useCallback } from 'react';
import CameraList from '../components/CameraList';
import CameraModal from '../components/CameraModal';
import Button from '../components/Button';
import { connect, create, listActive, changeActive } from '../api/camera';
import Navbar from '../components/Navbar';
import type { Camera } from '../interfaces/camera.interface';
import { useAuth } from '../contexts/AuthContext';

const Cameras: React.FC = () => {
  const { cameras, setCameras } = useAuth();
  const { surveillanceCenterId } = useAuth();
  const { userId } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showCameras, setShowCameras] = useState(false);
  const [lastAlerts, setLastAlerts] = useState<{ camera_name: string; timestamp: Date }[]>([]);

  // 🚦 Toggle verdadero/falso, y si hay cámaras las conecta
  const toggleShowCameras = useCallback(() => {
    if (showCameras) {
      setShowCameras(false);
    } else if (cameras.length > 0) {
      setShowCameras(true);
      cameras.forEach(cam => connect(cam.id!, cam.rtsp_url));
    }
  }, [cameras, showCameras]);

  const handleSelectCamera = async (camera: Camera) => {
  try {
    await connect(camera.id!, camera.rtsp_url);
    await changeActive(camera.id!, true);

    // Actualizamos directamente con cameras
    const updated = [...cameras, camera];
    setCameras(updated);
    setShowCameras(true);
  } catch (error) {
    console.error('Error al conectar la cámara:', error);
    alert('Error al conectar la cámara');
  }
};

const handleAddCamera = async (name: string, url: string) => {
  try {
    const newCam: Camera = await create({
      name,
      rtsp_url: url,
      surveillance_center: surveillanceCenterId
    });
    await connect(newCam.id!, newCam.rtsp_url);
    await changeActive(newCam.id!, true);

    const updated = [...cameras, newCam];
    setCameras(updated);
    setShowCameras(true);
    setShowModal(false);
  } catch {
    alert('Error al crear la cámara');
  }
};

const handleCloseCamera = useCallback(async (id: number) => {
  await changeActive(id, false);
  const filtered = cameras.filter(c => c.id !== id);
  setCameras(filtered);

  // Si ya no quedan, ocultamos la lista
  if (filtered.length === 0) {
    setShowCameras(false);
  }
}, [cameras]);

const handleDetection = useCallback((cameraId: number) => {
  const cam = cameras.find(c => c.id === cameraId);
  const name = cam?.name ?? `#${cameraId}`;
  setLastAlerts(prev => [...prev, { camera_name: name, timestamp: new Date() }]);
}, [cameras]);

useEffect(() => {
  listActive().then((list: Camera[] | undefined) => {
    const active: Camera[] = list || [];
    setCameras(active);
    // Ya no hacemos setShowCameras ni connect aquí:
    // if (active.length > 0) {
    //   setShowCameras(true);
    //   active.forEach((cam: Camera) => connect(cam.id!, cam.rtsp_url));
    // }
  });
}, []);



  return (
    <div className="bg-gray-700 text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-2xl mb-4">Cámaras en Vivo</h2>
          <div className="flex justify-between items-center mb-4 space-x-4">
            <Button
              type="button"
              text="Gestionar Cámaras"
              onClick={() => setShowModal(true)}
              className="bg-blue-500"
            />
            <Button
              type="button"
              text={showCameras ? "Ocultar cámaras activas" : "Mostrar cámaras activas"}
              onClick={toggleShowCameras}
              className="bg-green-500 hover:bg-green-600"
            />
          </div>

          {showCameras && (
            <div className="flex items-start">
              <div className="flex-1">
                <CameraList
                  cameras={cameras}
                  userId={userId}
                  onClose={handleCloseCamera}
                  onDetect={handleDetection}
                />
              </div>
            </div>
          )}
        </div>

        <aside className="w-64 flex flex-col bg-gray-900 border-l border-gray-600 h-[calc(100vh-4rem)]">
          <h2 className="font-semibold p-4 border-b border-gray-600 bg-gray-900">
            Historial de alertas
          </h2>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {lastAlerts.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay alertas recientes</p>
            ) : (
              lastAlerts.map((alert, i) => (
                <div key={i} className="text-sm p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors">
                  <div className="font-medium text-green-400">{alert.camera_name}</div>
                  <div className="text-gray-300 text-xs">{alert.timestamp.toLocaleTimeString()}</div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {showModal && (
        <CameraModal
          onClose={() => setShowModal(false)}
          onAddCamera={handleAddCamera}
          onSelectCamera={handleSelectCamera}
        />
      )}
    </div>
  );
};

export default Cameras;
