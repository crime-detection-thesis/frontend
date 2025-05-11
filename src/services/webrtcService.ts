export const connectToWebSocket = (cameraName: string, rtspUrl: string, videoElement: HTMLVideoElement | null) => {
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
