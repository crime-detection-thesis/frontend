// components/StreamViewer.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connectToWebSocket } from '../services/webrtcService';
import type { Camera } from '../interfaces/camera.interface';

interface StreamViewerProps {
  id: number;
  userId: number;
  onError: (id: number, msg: string) => void;
  cameras: Camera[];
  onDetect?: (cameraId: number) => void;
}

const THROTTLE_MS = 10_000;    // 10 segundos


const StreamViewer: React.FC<StreamViewerProps> = ({ id, userId, onError, cameras, onDetect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket>(null);
  const pcRef = useRef<RTCPeerConnection>(null);
  // justo debajo de donde defines videoRef…
  const lastAlertTimes = useRef<Record<number, number>>({});


  const [cameraOnAlert, setCameraOnAlert] = useState<string | null>(null);


  // cambia la firma para aceptar cameraId y cameras, pero realmente solo necesitas ID
const onDetection = useCallback((cameraId: number) => {
  const now = Date.now();
  const last = lastAlertTimes.current[cameraId] || 0;

  // solo disparamos si han pasado 10s para esa cámara
  if (now - last > THROTTLE_MS) {
    lastAlertTimes.current[cameraId] = now;

    // obtenemos el nombre
    const cam = cameras.find(c => c.id === cameraId);
    const name = cam?.name ?? `#${cameraId}`;

    setCameraOnAlert(name);
    setTimeout(() => setCameraOnAlert(null), 5_000);

    if (onDetect) onDetect(cameraId);
  }
}, [cameras]);


  useEffect(() => {
    if (!videoRef.current) return;

    const { ws, pc } = connectToWebSocket(
      id,
      userId,
      videoRef.current,
      (msg) => {
        onError(id, msg);
      },
      cameras,
      onDetection
    );
    wsRef.current = ws;
    pcRef.current = pc;

    return () => {
      wsRef.current?.close();
      pcRef.current?.close();
    };
  }, [id, userId, onDetection]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline controls className="rounded w-full" />
      {cameraOnAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          ⚠️ Delito detectado en {cameraOnAlert}
        </div>
      )}



    </>
  );
};

export default StreamViewer;
