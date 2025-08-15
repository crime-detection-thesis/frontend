import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';
import PageTitle from '../components/PageTitle';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useAuth();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert('Las contraseñas no coinciden');
        }
        register({ email, username, password });
    };
    
    return (
      <>
        <PageTitle title="Crear cuenta" />
        <FormContainer title="Crear cuenta">
            <form onSubmit={handleRegister}>
                <Input id="username" type="text" label="Usuario" value={username} onChange={e => setUsername(e.target.value)} required/>
                <Input id="email" type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                <Input id="password" type="password" label="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required/>
                <Input id="confirm" type="password" label="Repetir contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
                <Button type="submit" text="Crear cuenta" />
            </form>
            <div className="mt-4 text-center text-gray-400">
                <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </FormContainer>
      </>
    );
}
