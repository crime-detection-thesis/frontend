// components/CameraModal.tsx
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Select from './Select';
import { listInactive } from '../api/camera';
import type { Camera } from '../interfaces/camera.interface';

interface CameraModalProps {
  onClose: () => void;
  onAddCamera: (name: string, url: string) => void;  // crear nueva
  onSelectCamera: (camera: Camera) => void;          // elegir existente
}

const CameraModal: React.FC<CameraModalProps> = ({
  onClose,
  onAddCamera,
  onSelectCamera,
}) => {
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [cameraName, setCameraName] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [cameras, setCameras] = useState<Camera[]>([]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCamera(cameraName, rtspUrl);
    onClose();
  };

  const handleSelect = () => {
    const cam = cameras.find((c) => c.id === Number(selectedId));
    if (cam) {
      onSelectCamera(cam);
      onClose();
    }
  };

  useEffect(() => {
    listInactive().then((list) => setCameras(list));
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700/60 z-50">
      <div className="w-96 rounded-md bg-gray-800 p-6 shadow-lg">
        <div className="mb-4 flex">
          <Button type="button" text="Seleccionar" variant={mode==='select'? 'success':'secondary'} className="flex-1 rounded-none first:rounded-l-md last:rounded-r-md" onClick={() => setMode('select')} />
          <Button type="button" text="Agregar" variant={mode==='create'? 'success':'secondary'} className="flex-1 rounded-none first:rounded-l-md last:rounded-r-md" onClick={() => setMode('create')} />
        </div>

        {mode === 'select' ? (
          <>
            <h2 className="mb-4 text-xl font-semibold text-white">Elegir cámara</h2>
            <Select variant="dark" placeholder="Selecciona cámara" options={cameras.map(c => ({ label: c.name, value: String(c.id) }))} value={selectedId} onChange={setSelectedId} className="mb-6" />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" text="Cancelar" onClick={onClose} />
              <Button
                type="button"
                text="Seleccionar"
                variant="primary"
                onClick={handleSelect}
                disabled={!selectedId}
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-xl font-semibold text-white">Crear nueva cámara</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block mb-1 text-gray-200 text-sm">Nombre</label>
                <input
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-700 text-white border border-gray-600 px-2 py-1 focus:outline-none focus:ring"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-1 text-gray-200 text-sm">URL RTSP</label>
                <input
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  required
                  className="w-full rounded-md bg-gray-700 text-white border border-gray-600 px-2 py-1 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" text="Cancelar" variant="secondary" onClick={onClose} />
                <Button type="submit" text="Guardar" variant="primary" />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraModal;
