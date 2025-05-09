import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CameraViewer: React.FC = () => {
    const { state } = useLocation();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const camera = state?.camera; // Obtenemos el nombre de la cámara desde el estado de navegación

    useEffect(() => {
        if (camera) {
            console.log(`Conectando a la cámara: ${camera}`);
        }

        return () => {
        };
    }, [camera]);

    return (
        <div className="p-4">
            <h2 className="text-2xl text-white mb-4">Transmisión en vivo: {camera}</h2>
            <div className="bg-gray-800 p-6 rounded-md shadow-lg">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    controls
                    className="w-full h-full rounded-md"
                />
            </div>
        </div>
    );
};

export default CameraViewer;
