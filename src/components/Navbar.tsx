import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const userName = localStorage.getItem('userName') || 'Usuario';

    return (
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-400 hover:text-blue-600">
                    Cámaras
                </Link>
                <Link to="/dashboard" className="ml-4 text-xl font-bold text-blue-400 hover:text-blue-600">
                    Dashboard
                </Link>
                <Link to="/events" className="ml-4 text-xl font-bold text-blue-400 hover:text-blue-600">
                    Registro de Eventos
                </Link>
            </div>
            <div className="text-xl">
                <span>Bienvenido, {userName}</span>
            </div>
        </div>
    );
};

export default Navbar;
