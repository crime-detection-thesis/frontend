import React, { useEffect, useState, useCallback } from 'react';
import CameraList from '../components/CameraList';
import CameraModal from '../components/CameraModal';
import Button from '../components/Button';
import { connect, create, listActive, changeActive } from '../api/camera';
import Navbar from '../components/Navbar';
import type { Camera } from '../interfaces/camera.interface';
import { useAuth } from '../contexts/AuthContext';
import { useRef } from 'react';
import { getVideoGatewayUrl } from '../api/surveillance';

const Cameras: React.FC = () => {
  const { cameras, setCameras } = useAuth();
  const camerasRef = useRef<Camera[]>([]);
  const { surveillanceCenterId } = useAuth();
  const { userId } = useAuth();
  const { videoGatewayUrl, setVideoGatewayUrl } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showCameras, setShowCameras] = useState(false);
  const [lastAlerts, setLastAlerts] = useState<{ camera_name: string; timestamp: Date }[]>([]);

  // Utilidad para obtener el gateway URL y manejar errores
  const fetchGatewayUrlOrAlert = async (): Promise<string | null> => {
    try {
      const { data } = await getVideoGatewayUrl(surveillanceCenterId!);
      if (data.url) {
        setVideoGatewayUrl(data.url);
        return data.url;
      } else {
        console.error('No se pudo obtener la URL del gateway de video');
        alert('No se pudo obtener la URL del gateway de video');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la URL del gateway de video:', error);
      alert('Error al obtener la URL del gateway de video');
      return null;
    }
  };

  const toggleShowCameras = useCallback(async () => {
    if (showCameras) {
      setShowCameras(false);
    } else if (cameras.length > 0) {
      let url = videoGatewayUrl;
      if (!url) {
        url = await fetchGatewayUrlOrAlert();
      }
      if (url) {
        setShowCameras(true);
        cameras.forEach(cam => connect(url!, cam.id!, cam.rtsp_url));
      }
    }
  }, [cameras, showCameras, videoGatewayUrl]);

  const handleSelectCamera = async (camera: Camera) => {
    try {
      let url = videoGatewayUrl;
      if (!url) {
        url = await fetchGatewayUrlOrAlert();
      }
      if (url) {
        await connect(url, camera.id!, camera.rtsp_url);
        await changeActive(camera.id!, true);
        const updated = [...cameras, camera];
        setCameras(updated);
        setShowCameras(true);
      }
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

      let gatewayUrl = videoGatewayUrl;
      if (!gatewayUrl) {
        gatewayUrl = await fetchGatewayUrlOrAlert();
      }
      if (gatewayUrl) {
        await connect(gatewayUrl, newCam.id!, newCam.rtsp_url);
        await changeActive(newCam.id!, true);
        const updated = [...cameras, newCam];
        setCameras(updated);
        setShowCameras(true);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al crear la cámara:', error);
      alert('Error al crear la cámara');
    }
  };

  const handleCloseCamera = useCallback(async (id: number) => {
    await changeActive(id, false);
    const filtered = cameras.filter(c => c.id !== id);
    setCameras(filtered);

    if (filtered.length === 0) {
      setShowCameras(false);
    }
  }, [cameras]);

  const handleDetection = useCallback((cameraId: number) => {
    const cam = camerasRef.current.find(c => c.id === cameraId);
    const name = cam?.name ?? `#${cameraId}`;

    setLastAlerts(prev => [
      ...prev,
      { camera_name: name, timestamp: new Date() }
    ]);
  }, []);
  

  useEffect(() => {
    listActive().then((list: Camera[] | undefined) => {
      const active: Camera[] = list || [];
      setCameras(active);
    });
  }, []);

  useEffect(() => { camerasRef.current = cameras; }, [cameras]);

  return (
    <div className="text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 space-x-4">
            <Button
              type="button"
              text="Gestionar Cámaras"
              onClick={() => setShowModal(true)}
              variant="secondary"
            />
            <Button
              type="button"
              text={showCameras ? "Ocultar cámaras activas" : "Mostrar cámaras activas"}
              onClick={toggleShowCameras}
              variant="primary"
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
