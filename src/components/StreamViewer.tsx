import React, { useEffect, useRef, useState, useCallback } from 'react';
import { connectToWebSocket } from '../services/webrtcService';

interface StreamViewerProps {
  id: number;
  userId: number;
  onError: (id: number, msg: string) => void;
  onDetect?: (cameraId: number) => void;
}

const THROTTLE_MS = 10_000;

const StreamViewer: React.FC<StreamViewerProps> = ({ id, userId, onError, onDetect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket>(null);
  const pcRef = useRef<RTCPeerConnection>(null);
  const lastAlertTimes = useRef<Record<number, number>>({});
  const [showAlert, setShowAlert] = useState(false);
  const alertTimeoutRef = useRef<number | null>(null);

  const onDetection = useCallback((cameraId: number) => {
    const now = Date.now();
    const last = lastAlertTimes.current[cameraId] || 0;

    if (now - last > THROTTLE_MS) {
      lastAlertTimes.current[cameraId] = now;
      
      if (alertTimeoutRef.current !== null) {
        window.clearTimeout(alertTimeoutRef.current);
      }
      
      setShowAlert(true);
      alertTimeoutRef.current = window.setTimeout(() => setShowAlert(false), 5_000);

      if (onDetect) onDetect(cameraId);
    }
  }, [onDetect]);


  useEffect(() => {
    if (!videoRef.current) return;

    const { ws, pc } = connectToWebSocket(
      id,
      userId,
      videoRef.current,
      (msg) => {
        onError(id, msg);
      },
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
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg shadow bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          controls 
          className="w-full"
          style={{ aspectRatio: '16/9' }}
        />
      </div>
      {showAlert && (
        <div className="flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-md border border-amber-200 w-full justify-center">
          <svg 
            className="w-4 h-4 mr-2 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-sm font-bold">Actividad sospechosa detectada</span>
        </div>
      )}
    </div>
  );
};

export default StreamViewer;
