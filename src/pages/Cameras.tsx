import React, { useState } from 'react';
import CameraList from '../components/CameraList';
import CreateCameraModal from '../components/CreateCameraModal';
import Button from '../components/Button';
import { addCamera } from '../api/camera';
import Navbar from "../components/Navbar.tsx"; // Importamos la función addCamera

const Cameras: React.FC = () => {
    const [cameras, setCameras] = useState<{ name: string; url: string }[]>([]);
    const [showModal, setShowModal] = useState(false);

    const handleAddCamera = async (name: string, url: string) => {
        try {
            const response = await addCamera(name, url);
            console.log('Cámara conectada:', response);
            setCameras((prevCameras) => [...prevCameras, { name, url }]);
        } catch (error) {
            alert('Error al conectar la cámara.');
        }
    };

    const handleCloseCamera = (cameraName: string) => {
        setCameras((prevCameras) => prevCameras.filter((camera) => camera.name !== cameraName));
    };

    return (
      <div className="bg-gray-900 text-white min-h-screen">
          <Navbar />
          <div className="p-4">
              <h2 className="text-2xl text-white mb-4">Cámaras en Vivo</h2>

              <Button
                type="button"
                text="Agregar Cámara"
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white mb-6"
              />

              <CameraList cameras={cameras} onClose={handleCloseCamera} />
          </div>

          {showModal && (
            <CreateCameraModal
              onClose={() => setShowModal(false)}
              onAddCamera={handleAddCamera}
            />
          )}
      </div>
    );
};

export default Cameras;
