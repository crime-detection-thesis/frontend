import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navbar: React.FC = () => {
  const { userName, logout } = useAuth();
  const { pathname } = useLocation();

  const linkClass = (path: string) => {
    const base = "px-3 py-2 text-lg font-medium transition-colors";
    if (pathname === path) {
      // activa: verde + subrayado
      return `${base} text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]`;
    }
    // inactiva: texto blanco, y al hover fondo oscuro + texto verde
    return `${base} !text-white hover:bg-gray-800 hover:text-[var(--color-primary)]`;
  };
  

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md w-full">
  <div className="flex flex-wrap justify-between items-center w-full px-6 py-3">
    <div className="flex space-x-4">
      <Link to="/camaras"   className={linkClass('/camaras')}>Cámaras</Link>
      <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
      <Link to="/alertas"    className={linkClass('/alertas')}>Registro de Alertas</Link>
    </div>

    <div className="flex items-center space-x-4">
      <span className="text-gray-300 whitespace-nowrap">
        Bienvenido, <strong className="text-white">{userName ?? 'Usuario'}</strong>
      </span>
      <Button
        type="button"
        text="Cerrar sesión"
        variant="danger"
        onClick={logout}
      />
    </div>
  </div>
</nav>

  );
};

export default Navbar;
