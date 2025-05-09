import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
// import { createSurveillanceCenter } from '../api/surveillance';
import FormContainer from "../components/FormContainer.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";

const CreateSurveillanceCenter: React.FC = () => {
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const navigate = useNavigate();

    const handleCreateCenter = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !latitude || !longitude) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        try {
            // await createSurveillanceCenter(name, latitude, longitude);
            alert('Centro de vigilancia creado con éxito');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al crear el centro:', error);
            alert('Hubo un error al crear el centro.');
        }
    };

    return (
        <FormContainer title="Crear Centro de Vigilancia">
            <form onSubmit={handleCreateCenter}>
                <Input
                    id="name"
                    type="text"
                    label="Nombre del Centro"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    id="latitude"
                    type="text"
                    label="Latitud"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                />
                <Input
                    id="longitude"
                    type="text"
                    label="Longitud"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                />
                <Button type="submit" text="Crear Centro" />
            </form>
        </FormContainer>
    );
};

export default CreateSurveillanceCenter;
