import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="p-4">
                <h2 className="text-2xl text-white mb-4">Dashboard</h2>
                <div className="bg-gray-800 p-6 rounded-md shadow-lg">
                    <p className="text-white">Resumen de la actividad del sistema, estadísticas, etc.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
