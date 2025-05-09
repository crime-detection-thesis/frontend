import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
// import { registerUser } from '../api/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // await registerUser(email, password);
            localStorage.setItem('userName', name);
            navigate('/select-surveillance-center');
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Hubo un error al registrar al usuario');
        }
    };

    return (
        <FormContainer title="Crear cuenta">
            <form onSubmit={handleRegister}>
                <Input
                    id="name"
                    type="text"
                    label="Nombre de usuario"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    id="email"
                    type="email"
                    label="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    id="password"
                    type="password"
                    label="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Input
                    id="confirmPassword"
                    type="password"
                    label="Repetir contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button type="submit" text="Crear cuenta"/>
            </form>

            <div className="mt-4 text-center text-gray-400">
                <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-600">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </FormContainer>
    );
};

export default Register;
