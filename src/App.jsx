import { useState } from "react";
import StreamViewer from "./StreamViewer";

function App() {
    const [rtspUrl, setRtspUrl] = useState("");
    const [cameraName, setCameraName] = useState("");
    const [streams, setStreams] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { rtspUrl, cameraName };

        const response = await fetch("http://localhost:8000/api/camera", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("Cámara conectada y transmisión iniciada.");
            setStreams((prev) => [...prev, { rtspUrl, cameraName }]);
            setRtspUrl("");
            setCameraName("");
        } else {
            alert("Error al conectar la cámara.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow-lg mb-6">
                <h2 className="text-black text-xl font-bold mb-4">Conectar Cámara RTSP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="cameraName" className="block text-black text-sm font-medium">
                            Nombre de la cámara
                        </label>
                        <input
                            type="text"
                            id="cameraName"
                            value={cameraName}
                            onChange={(e) => setCameraName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="rtspUrl" className="block text-black text-sm font-medium">
                            URL RTSP
                        </label>
                        <input
                            type="text"
                            id="rtspUrl"
                            value={rtspUrl}
                            onChange={(e) => setRtspUrl(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Conectar Cámara
                    </button>
                </form>
            </div>

            {/* Mostrar transmisiones activas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/*{streams.map((stream) => (*/}
                {/*    <StreamViewer*/}
                {/*        key={stream.cameraName}*/}
                {/*        rtspUrl={stream.rtspUrl}*/}
                {/*        cameraName={stream.cameraName}*/}
                {/*    />*/}
                {/*))}*/}

                {streams.map((stream) => (
                    <div key={stream.cameraName} className="relative">
                        <StreamViewer
                            rtspUrl={stream.rtspUrl}
                            cameraName={stream.cameraName}
                        />
                        <button
                            onClick={() =>
                                setStreams(prev => prev.filter(s => s.cameraName !== stream.cameraName))
                            }
                            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
                        >
                            Cerrar
                        </button>
                    </div>
                ))}

                {streams.length === 0 && (
                    <div className="col-span-1 text-center text-gray-500">
                        No hay transmisiones activas.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;



