import React, { useEffect, useRef } from 'react';
import { connectToWebSocket } from '../services/webrtcService';

interface StreamViewerProps {
  rtspUrl: string;
  cameraName: string;
  onDetect?: (cameraName: string, detections: any[]) => void;
}

const StreamViewer: React.FC<StreamViewerProps> = ({ rtspUrl, cameraName, onDetect, }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const { ws, pc } = connectToWebSocket(cameraName, rtspUrl, videoRef.current, onDetect);

      wsRef.current = ws;
      pcRef.current = pc;

      return () => {
        ws.close();
        pc.close();
      };
    }
  }, [rtspUrl, cameraName, onDetect]);

  return (
    <div className="bg-white p-2 rounded shadow relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        className="rounded w-full"
      />
    </div>
  );
};

export default StreamViewer;
