import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';
import { useAuth } from '../contexts/AuthContext';
import PageTitle from '../components/PageTitle';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, userId, isInitializing } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);  // ahora usa el método del AuthContext
        } catch (err) {
            console.error('Login failed', err);
            alert('Login failed');
        }
    };

    useEffect(() => {
        if (!isInitializing && userId) {
          navigate('/dashboard', { replace: true });
        }
      }, [isInitializing, userId, navigate]);

    return (
      <>
        <PageTitle title="Iniciar sesión" />
        <FormContainer title="Iniciar sesión">
            <form onSubmit={handleLogin}>
                <Input
                  id="email"
                  type="email"
                  label="Correo electrónico"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="password"
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" text="Acceder" />
            </form>
            <div className="mt-4 text-center text-gray-400">
                <p>
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register">
                        Regístrate
                    </Link>
                </p>
            </div>
        </FormContainer>
      </>
    );
};

export default Login;
