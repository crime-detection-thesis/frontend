import React from 'react';
import Navbar from '../components/Navbar';

const Events: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="p-4">
                <h2 className="text-2xl text-white mb-4">Registro de Eventos</h2>
                <div className="bg-gray-800 p-6 rounded-md shadow-lg">
                    <p className="text-white">Eventos registrados, como alertas y detecciones.</p>
                </div>
            </div>
        </div>
    );
};

export default Events;
