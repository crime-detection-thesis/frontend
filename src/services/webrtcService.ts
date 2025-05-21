export const connectToWebSocket = (
  cameraName: string, 
  rtspUrl: string, 
  videoElement: HTMLVideoElement | null, 
  onDetect?: (camera: string, detections: any[]) => void) => {
  const ws = new WebSocket(`ws://localhost:8002/ws/${cameraName}`);
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  });

  pc.ontrack = (event: RTCTrackEvent) => {
    if (videoElement) {
      videoElement.srcObject = event.streams[0];
    }
  };

  // 2) Escuchar DataChannel “detections”
  pc.ondatachannel = (ev) => {
    if (ev.channel.label === 'detections') {
      const dc = ev.channel;
      console.log('DataChannel opened:', dc.label);
      dc.onmessage = (msg) => {
        const { detections } = JSON.parse(msg.data);
        onDetect && onDetect(cameraName, detections);
      };
    }
  };

  const startStream = async () => {
    const offer = await pc.createOffer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({
      sdp: pc.localDescription.sdp,
      type: pc.localDescription.type,
      rtspUrl,
      cameraName
    }));
  };

  ws.onopen = startStream;

  ws.onmessage = async (message) => {
    const data = JSON.parse(message.data);
    const remoteDesc = new RTCSessionDescription(data);
    await pc.setRemoteDescription(remoteDesc);
  };

  return { ws, pc };
};
