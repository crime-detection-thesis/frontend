import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const userName = localStorage.getItem('userName') || 'Usuario';

    const handleLogout = () => {
        localStorage.removeItem('userName');
        window.location.href = '/login';
    }

    return (
        <div className="bg-gray-800 text-white shadow-lg p-4">
            <div className="flex justify-between items-center">
                <div className="flex space-x-6">
                    <Link
                        to="/cameras"
                        className="text-xl font-semibold hover:text-blue-500 transition-colors"
                    >
                        Cámaras
                    </Link>
                    <Link
                        to="/dashboard"
                        className="text-xl font-semibold hover:text-blue-500 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/events"
                        className="text-xl font-semibold hover:text-blue-500 transition-colors"
                    >
                        Registro de Eventos
                    </Link>
                </div>

                <div className="flex items-center space-x-3">
                    <span className="text-lg">Bienvenido, <strong>{userName}</strong></span>
                    <button className="text-sm text-blue-400 hover:text-blue-600 transition-colors" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
