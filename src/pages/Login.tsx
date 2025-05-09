import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <FormContainer title="Iniciar sesión">
            <form onSubmit={handleLogin}>
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
                <Button type="submit" text="Acceder" />
            </form>
            <div className="mt-4 text-center text-gray-400">
                <p>
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-600">
                        Regístrate
                    </Link>
                </p>
            </div>
        </FormContainer>
    );
};

export default Login;
