export const connectToWebSocket = (
  id: number,
  userId: number,
  videoElement: HTMLVideoElement | null,
  onError: (msg: string) => void,
  onDetection: (camera_id: number) => void,
) => {
  const ws = new WebSocket(
    `ws://${import.meta.env.VITE_SIGNALING_URL}/ws/${id}`
  );

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
    ],
  });

  // 1) Mostrar el stream
  pc.ontrack = (e) => {
    if (videoElement) videoElement.srcObject = e.streams[0];
  };

  // 2) Trickle ICE: enviamos cada candidato local
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      ws.send(JSON.stringify({ candidate: e.candidate }));
    }
  };

  // 3) Al abrir WS, creamos y enviamos la offer
  ws.onopen = async () => {
    const offer = await pc.createOffer({ offerToReceiveVideo: true });
    await pc.setLocalDescription(offer);
    ws.send(
      JSON.stringify({
        sdp: pc.localDescription?.sdp,
        type: pc.localDescription?.type,
        camera_id: id,
        user_id: userId,
      })
    );
  };

  // 4) Mensajes entrantes: error / SDP answer / ICE candidates
  ws.onmessage = async (evt) => {
    let msg: any;
    try {
      msg = JSON.parse(evt.data);
      if (msg.event === 'detection') {
        if (msg.camera_id) {
          onDetection(msg.camera_id);
        }
        return;
      }
    } catch {
      return;
    }

    // 4.1) Solo aquí invocamos onError
    if (msg.error) {
      onError(msg.error);
      ws.close();
      return;
    }

    // 4.2) Respuesta SDP
    if (msg.sdp && msg.type) {
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: msg.type, sdp: msg.sdp })
      );
      return;
    }

    // 4.3) Candidato remoto
    if (msg.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
      } catch (err) {
        console.warn('No pude añadir ICE remoto:', err);
      }
    }
  };

  // 5) Al cerrar WS, cerramos el PeerConnection
  ws.onclose = () => {
    if (pc.connectionState !== 'closed') pc.close();
  };

  return { ws, pc };
};
