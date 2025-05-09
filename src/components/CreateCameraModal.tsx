import React, { useState } from 'react';
import Button from './Button';

interface CreateCameraModalProps {
    onClose: () => void;
    onAddCamera: (name: string, url: string) => void;
}

const CreateCameraModal: React.FC<CreateCameraModalProps> = ({ onClose, onAddCamera }) => {
    const [cameraName, setCameraName] = useState('');
    const [rtspUrl, setRtspUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cameraName && rtspUrl) {
            onAddCamera(cameraName, rtspUrl);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-80 z-60">
                <h2 className="text-2xl mb-4 text-black">Conectar Cámara RTSP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Nombre de la cámara</label>
                        <input
                            type="text"
                            value={cameraName}
                            onChange={(e) => setCameraName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700">URL RTSP</label>
                        <input
                            type="text"
                            value={rtspUrl}
                            onChange={(e) => setRtspUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <Button
                            type="button"
                            text="Cancelar"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white"
                        />
                        <Button
                            type="submit"
                            text="Conectar Cámara"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCameraModal;
