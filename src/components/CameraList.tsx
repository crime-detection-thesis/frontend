import React from 'react';
import Button from './Button'; // Importando el componente Button

interface CameraListProps {
    cameras: { name: string, url: string }[];
    onClose: (cameraName: string) => void;
}

const CameraList: React.FC<CameraListProps> = ({ cameras, onClose }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((camera, index) => (
                <div key={index} className="relative bg-gray-800 p-6 rounded-md shadow-md">
                    <h3 className="text-white mb-2">{camera.name}</h3>
                    <div className="relative mb-2">
                        <video
                            autoPlay
                            playsInline
                            controls
                            className="w-full h-56 rounded-md"
                        >
                            {/* Aquí irá la lógica de WebRTC cuando se conecte la cámara */}
                        </video>
                    </div>
                    <Button
                        type="button"
                        text="Cerrar"
                        onClick={() => onClose(camera.name)} // Cerrar la cámara
                        className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-700 text-white"
                    />
                </div>
            ))}
        </div>
    );
};

export default CameraList;
