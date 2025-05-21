import React, { useState } from 'react';
import StreamViewer from './StreamViewer';
import Button from './Button';
interface CameraListProps {
  cameras: { name: string; url: string }[];
  onClose: (cameraName: string) => void;
}

const CameraList: React.FC<CameraListProps> = ({ cameras, onClose }) => {
  const [alerts, setAlerts] = useState<Record<string, boolean>>({});

  const handleDetect = (cameraName: string, detections: any[]) => {
    if (detections.some(d => d.label === 'pistol')) {
      setAlerts(a => ({ ...a, [cameraName]: true }));
      setTimeout(() => {
        setAlerts(a => ({ ...a, [cameraName]: false }));
      }, 5000);
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera, index) => (
        <div key={index} className="relative bg-gray-800 p-6 rounded-md shadow-md">
          <h3 className="text-white mb-2 text-center">{camera.name}</h3>

          <StreamViewer
            rtspUrl={camera.url}
            cameraName={camera.name}
            onDetect={handleDetect}
          />

          <div
            className={`mt-2 p-2 rounded text-center font-semibold ${
              alerts[camera.name]
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {alerts[camera.name]
              ? '🚨 Pistola detectada!'
              : 'Sin alertas'}
          </div>

          <Button
            type="button"
            text="Cerrar"
            onClick={() => onClose(camera.name)}
            className="absolute bottom-2 right-2 mt-2 bg-red-500 hover:bg-red-700 text-white"
          />
        </div>
      ))}
    </div>
  );
};

export default CameraList;
