import React, { useEffect, useRef } from "react";

const StreamViewer = ({ rtspUrl, cameraName }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        });

        const ws = new WebSocket(`ws://127.0.0.1:8002/ws/${cameraName}`);

        pc.ontrack = (event) => {
            if (videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
            }
        };


        const startStream = async () => {
            const offer = await pc.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
        };

        ws.onopen = async () => {
            await startStream();
            ws.send(
                JSON.stringify({
                    sdp: pc.localDescription.sdp,
                    type: pc.localDescription.type,
                    rtspUrl: rtspUrl,
                    cameraName: cameraName,
                })
            );
        };

        ws.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            const remoteDesc = new RTCSessionDescription(data);
            await pc.setRemoteDescription(remoteDesc);
        };

        return () => {
            ws.close();
            pc.close();
        };
    }, [rtspUrl, cameraName]);

    return (
        <div className="bg-white p-2 rounded shadow">
            <h3 className="text-center text-black font-semibold mb-1">{cameraName}</h3>
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


