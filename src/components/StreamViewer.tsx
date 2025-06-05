import React, { useEffect, useRef } from 'react';
import { connectToWebSocket } from '../services/webrtcService';

interface StreamViewerProps {
  rtspUrl: string;
  cameraName: string;
}

const StreamViewer: React.FC<StreamViewerProps> = ({ rtspUrl, cameraName }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    console.log(`Connecting to camera: ${cameraName} with RTSP URL: ${rtspUrl}`);
    if (videoRef.current) {
      console.log(`Video element found for camera: ${cameraName}`);
      const { ws, pc } = connectToWebSocket(cameraName, rtspUrl, videoRef.current);
      if (!ws || !pc) {
        console.error(`Failed to connect WebSocket or PeerConnection for camera: ${cameraName}`);
        return;
      }

      wsRef.current = ws;
      pcRef.current = pc;

      return () => {
        ws.close();
        pc.close();
      };
    }
  }, [rtspUrl, cameraName]);

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
