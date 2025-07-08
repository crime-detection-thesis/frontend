// src/components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { userName, logout } = useAuth();
  const { pathname } = useLocation();

  const linkClass = (path: string) => {
    const base = "px-3 py-2 text-lg font-medium transition-colors";
    if (pathname === path) {
      return `${base} text-white bg-gray-800 rounded`;  
      // ó sustituye bg-gray-800 por 'border-b-2 border-green-500' si prefieres subrayado
    }
    return `${base} text-green-400 hover:text-white hover:bg-gray-800 rounded`;
  };

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <div className="flex space-x-4">
          <Link to="/cameras"   className={linkClass('/cameras')}>Cámaras</Link>
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/events"    className={linkClass('/events')}>Registro de Eventos</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">
            Bienvenido, <strong className="text-white">{userName ?? 'Usuario'}</strong>
          </span>
          <button
            onClick={logout}
            className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-1 rounded-md transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
