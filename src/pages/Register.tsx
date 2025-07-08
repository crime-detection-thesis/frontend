// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import FormContainer from '../components/FormContainer';
//
// interface PendingUser {
//     email: string;
//     username: string;
//     password: string;
// }
//
// export default function Register() {
//     const [email, setEmail] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const navigate = useNavigate();
//
//     const handleRegister = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (password !== confirmPassword) {
//             return alert('Las contraseñas no coinciden');
//         }
//         // Guardamos temporalmente los datos del usuario en localStorage
//         const pending: PendingUser = { email, username, password };
//         localStorage.setItem('pendingUser', JSON.stringify(pending));
//         navigate('/select-surveillance-center');
//     };
//
//     return (
//       <FormContainer title="Crear cuenta">
//           <form onSubmit={handleRegister}>
//               <Input
//                 id="username"
//                 type="text"
//                 label="Nombre de usuario"
//                 value={username}
//                 onChange={e => setUsername(e.target.value)}
//                 required
//               />
//               <Input
//                 id="email"
//                 type="email"
//                 label="Correo electrónico"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//               />
//               <Input
//                 id="password"
//                 type="password"
//                 label="Contraseña"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//               />
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 label="Repetir contraseña"
//                 value={confirmPassword}
//                 onChange={e => setConfirmPassword(e.target.value)}
//                 required
//               />
//               <Button type="submit" text="Siguiente" />
//           </form>
//       </FormContainer>
//     );
// }
//
//





import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import Input from '../components/Input';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';

export default function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { setPending } = useRegistration();
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return alert('Contraseñas no coinciden');
        setPending({ email, username, password });
        navigate('/select-surveillance-center');
    };

    return (
      <FormContainer title="Crear cuenta">
          <form onSubmit={handleRegister}>
              <Input id="username" type="text" label="Usuario" value={username} onChange={e => setUsername(e.target.value)} required/>
              <Input id="email" type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
              <Input id="password" type="password" label="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required/>
              <Input id="confirm" type="password" label="Repetir contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
              <Button type="submit" text="Siguiente" className="bg-blue-500 hover:bg-blue-600" />
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
}
