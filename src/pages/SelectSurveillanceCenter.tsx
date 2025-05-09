import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
// import { getSurveillanceCenters } from '../api/surveillance';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';

const SelectSurveillanceCenter: React.FC = () => {
    const [centers, setCenters] = useState<any[]>([]);
    const [selectedCenter, setSelectedCenter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                // const response = await getSurveillanceCenters();
                // setCenters(response.data);
                const centers = [
                    {
                        id: 1,
                        name: 'Centro 1',
                    },
                    {
                        id: 2,
                        name: 'Centro 2',
                    },
                    {
                        id: 3,
                        name: 'Centro 3',
                    },
                ]
                setCenters(centers);
            } catch (error) {
                console.error('Error al obtener los centros de vigilancia:', error);
            }
        };

        fetchCenters();
    }, []);

    const handleNext = () => {
        if (!selectedCenter) {
            alert('Debes seleccionar un centro de vigilancia.');
            return;
        }

        navigate('/dashboard');
    };

    return (
        <FormContainer title="Selecciona tu Centro de Vigilancia">
            <div className="mb-4">
                <label htmlFor="center" className="block text-gray-300 text-sm font-medium">
                    Elige tu Centro de Vigilancia
                </label>
                <select
                    id="center"
                    value={selectedCenter}
                    onChange={(e) => setSelectedCenter(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecciona un centro</option>
                    {centers.map((center) => (
                        <option key={center.id} value={center.id}>{center.name}</option>
                    ))}
                </select>
            </div>
            <Button type="button" text="Siguiente" onClick={handleNext} />
            <div className="mt-4 text-center text-gray-400">
                <p>
                    ¿No encuentras tu centro?{' '}
                    <Link to="/create-surveillance-center" className="text-blue-400 hover:text-blue-600">
                        Registra tu centro
                    </Link>
                </p>
            </div>
        </FormContainer>
    );
};

export default SelectSurveillanceCenter;
