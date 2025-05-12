// import React, { useState, useEffect } from 'react';
// import {Link, useNavigate} from 'react-router-dom';
// // import { getSurveillanceCenters } from '../api/surveillance';
// import Button from '../components/Button';
// import FormContainer from '../components/FormContainer';
//
// const SelectSurveillanceCenter: React.FC = () => {
//     const [centers, setCenters] = useState<any[]>([]);
//     const [selectedCenter, setSelectedCenter] = useState('');
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchCenters = async () => {
//             try {
//                 // const response = await getSurveillanceCenters();
//                 // setCenters(response.data);
//                 const centers = [
//                     {
//                         id: 1,
//                         name: 'Centro 1',
//                     },
//                     {
//                         id: 2,
//                         name: 'Centro 2',
//                     },
//                     {
//                         id: 3,
//                         name: 'Centro 3',
//                     },
//                 ]
//                 setCenters(centers);
//             } catch (error) {
//                 console.error('Error al obtener los centros de vigilancia:', error);
//             }
//         };
//
//         fetchCenters();
//     }, []);
//
//     const handleNext = () => {
//         if (!selectedCenter) {
//             alert('Debes seleccionar un centro de vigilancia.');
//             return;
//         }
//
//         navigate('/dashboard');
//     };
//
//     return (
//         <FormContainer title="Selecciona tu Centro de Vigilancia">
//             <div className="mb-4">
//                 <label htmlFor="center" className="block text-gray-300 text-sm font-medium">
//                     Elige tu Centro de Vigilancia
//                 </label>
//                 <select
//                     id="center"
//                     value={selectedCenter}
//                     onChange={(e) => setSelectedCenter(e.target.value)}
//                     className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
//                 >
//                     <option value="">Selecciona un centro</option>
//                     {centers.map((center) => (
//                         <option key={center.id} value={center.id}>{center.name}</option>
//                     ))}
//                 </select>
//             </div>
//             <Button type="button" text="Siguiente" onClick={handleNext} />
//             <div className="mt-4 text-center text-gray-400">
//                 <p>
//                     ¿No encuentras tu centro?{' '}
//                     <Link to="/create-surveillance-center" className="text-blue-400 hover:text-blue-600">
//                         Registra tu centro
//                     </Link>
//                 </p>
//             </div>
//         </FormContainer>
//     );
// };
//
// export default SelectSurveillanceCenter;





// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getSurveillanceCenters, Center } from '../api/surveillance';
// import { registerUser, loginUser, RegisterData } from '../api/auth';
// import Button from '../components/Button';
// import FormContainer from '../components/FormContainer';
//
// const SelectSurveillanceCenter: React.FC = () => {
//   const [centers, setCenters] = useState<Center[]>([]);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const navigate = useNavigate();
//
//   // Cargamos los centros al montar
//   useEffect(() => {
//     getSurveillanceCenters()
//       .then(res => setCenters(res.data))
//       .catch(() => alert('Error al cargar centros'));
//   }, []);
//
//   // Recupera el usuario pendiente
//   const pendingJson = localStorage.getItem('pendingUser');
//   if (!pendingJson) {
//     navigate('/register');
//     return null;
//   }
//   const pendingUser: Omit<RegisterData, 'surveillance_center_id'> = JSON.parse(pendingJson);
//
//   const completeRegistration = async (centerId: number) => {
//     try {
//       const payload: RegisterData = {
//         ...pendingUser,
//         surveillance_center_id: centerId,
//       };
//       await registerUser(payload);
//       // al registrar, hacemos login automático
//       await loginUser(pendingUser.email, pendingUser.password);
//       localStorage.removeItem('pendingUser');
//       navigate('/dashboard');
//     } catch (err) {
//       console.error(err);
//       alert('Error registrando usuario');
//     }
//   };
//
//   return (
//     <FormContainer title="Selecciona o crea un centro de vigilancia">
//       <ul className="mb-4">
//         {centers.map(c => (
//           <li key={c.id}>
//             <label>
//               <input
//                 type="radio"
//                 name="center"
//                 value={c.id}
//                 checked={selectedId === c.id}
//                 onChange={() => setSelectedId(c.id)}
//               />
//               <span className="ml-2">{c.name}</span>
//             </label>
//           </li>
//         ))}
//       </ul>
//
//       <div className="flex space-x-2">
//         <Button
//           type="button"
//           text="Continuar"
//           onClick={() => {
//             if (selectedId) completeRegistration(selectedId);
//             else alert('Selecciona un centro');
//           }}
//         />
//         <Button
//           type="button"
//           text="Crear nuevo centro"
//           onClick={() => navigate('/create-surveillance-center')}
//           className="bg-gray-500 hover:bg-gray-600"
//         />
//       </div>
//     </FormContainer>
//   );
// }
//
// export default SelectSurveillanceCenter;




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getSurveillanceCenters, Center } from '../api/surveillance';
// import { registerUser, loginUser, RegisterData } from '../api/auth';
// import Button from '../components/Button';
// import FormContainer from '../components/FormContainer';
//
// const SelectSurveillanceCenter: React.FC = () => {
//   const [centers, setCenters] = useState<Center[]>([]);
//   const [selectedId, setSelectedId] = useState<number | ''>('');
//   const navigate = useNavigate();
//
//   // Carga los centros al montar
//   useEffect(() => {
//     getSurveillanceCenters()
//       .then(res => setCenters(res.data))
//       .catch(() => alert('Error al cargar centros'));
//   }, []);
//
//   // Recupera el usuario pendiente de registro
//   const pendingJson = localStorage.getItem('pendingUser');
//   if (!pendingJson) {
//     navigate('/register');
//     return null;
//   }
//   const pendingUser: Omit<RegisterData, 'surveillance_center_id'> = JSON.parse(pendingJson);
//
//   const completeRegistration = async (centerId: number) => {
//     try {
//       const payload: RegisterData = {
//         ...pendingUser,
//         surveillance_center_id: centerId,
//       };
//       await registerUser(payload);
//       await loginUser(pendingUser.email, pendingUser.password);
//       localStorage.removeItem('pendingUser');
//       navigate('/dashboard');
//     } catch (err) {
//       console.error(err);
//       alert('Error registrando usuario');
//     }
//   };
//
//   return (
//     <FormContainer title="Selecciona o crea un centro de vigilancia">
//       <div className="mb-4">
//         <label htmlFor="center" className="block mb-1">
//           Centros disponibles:
//         </label>
//         <select
//           id="center"
//           className="w-full border rounded p-2"
//           value={selectedId}
//           onChange={e => setSelectedId(e.target.value === '' ? '' : Number(e.target.value))}
//         >
//           <option value="" className="text-black">-- Selecciona un centro --</option>
//           {centers.map(c => (
//             <option key={c.id} value={c.id} className="text-black">
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>
//
//       <div className="flex space-x-2">
//         <Button
//           type="button"
//           text="Continuar"
//           onClick={() => {
//             if (selectedId !== '') completeRegistration(selectedId);
//             else alert('Selecciona un centro');
//           }}
//         />
//         <Button
//           type="button"
//           text="Crear nuevo centro"
//           onClick={() => navigate('/create-surveillance-center')}
//           className="bg-gray-500 hover:bg-gray-600"
//         />
//       </div>
//     </FormContainer>
//   );
// };
//
// export default SelectSurveillanceCenter;






import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../contexts/RegistrationContext';
import { useAuth } from '../contexts/AuthContext';
import { Center, getSurveillanceCenters } from '../api/surveillance';
import Button from '../components/Button';
import FormContainer from '../components/FormContainer';

export default function SelectSurveillanceCenter() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const { pending } = useRegistration();
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getSurveillanceCenters()
      .then(r => setCenters(r.data))
      .catch(() => alert('Error cargando centros'));
  }, []);

  if (!pending) {
    navigate('/register');
    return null;
  }

  const onContinue = () => {
    if (!selectedId) return alert('Selecciona un centro');
    register({
      email: pending.email,
      username: pending.username,
      password: pending.password,
      surveillance_center_id: selectedId as number,
    });
  };

  return (
    <FormContainer title="Selecciona o crea un centro">
      <select
        className="w-full border p-2 rounded mb-4"
        value={selectedId}
        onChange={e => setSelectedId(e.target.value === '' ? '' : Number(e.target.value))}
      >
        <option value="" className="text-black">-- Elige un centro --</option>
        {centers.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
      </select>
      <div className="flex space-x-2">
        <Button type="button" text="Finalizar registro" className="bg-blue-500 hover:bg-blue-600" onClick={onContinue}/>
        <Button type="button" text="Crear nuevo centro" className="bg-gray-500 hover:bg-gray-600" onClick={() => navigate('/create-surveillance-center')}/>
      </div>
    </FormContainer>
  );
}
