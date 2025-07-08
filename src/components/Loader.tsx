import React from 'react';

interface LoaderProps {
  message?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Cargando...', className = '' }) => (
  <div className={`${className} flex flex-col items-center justify-center`}>
    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    <p className="mt-4 text-lg text-gray-400">{message}</p>
  </div>
);

export default Loader;
