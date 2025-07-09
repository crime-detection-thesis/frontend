import React from 'react';
import StreamViewer from './StreamViewer';
import Button from './Button';
import type { Camera } from '../interfaces/camera.interface';
import Card from './Card';

interface CameraListProps {
  cameras: Camera[];
  userId: number;
  onClose: (id: number) => void;
  onDetect: (id: number) => void;
}

const CameraList: React.FC<CameraListProps> = ({ cameras, userId, onClose, onDetect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <div key={camera.id!}>
          <Card>
            <h3 className="text-white mb-2 text-center">{camera.name}</h3>
            <StreamViewer
              id={camera.id!}
              userId={userId}
              onError={(id, msg) => {
                alert(msg);
                onClose(id);
              }}
              onDetect={onDetect}
            />

            <Button
              type="button"
              text="Cerrar"
              variant='danger'
              className="bottom-2 right-2 mt-2"
              onClick={() => onClose(camera.id!)}
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

export default CameraList;
