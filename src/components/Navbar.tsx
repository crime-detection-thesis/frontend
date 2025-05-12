// // import React from 'react';
// // import {Link, useNavigate} from 'react-router-dom';
// // import {logoutUser} from "../api/auth.ts";
// //
// // const Navbar: React.FC = () => {
// //     const userName = localStorage.getItem('userName') || 'Usuario';
// //     const navigate = useNavigate();
// //
// //     // const handleLogout = () => {
// //     //     // localStorage.removeItem('userName');
// //     //     window.location.href = '/login';
// //     // }
// //
// //     const handleLogout = async () => {
// //         try {
// //             await logoutUser();          // Llama al endpoint de logout (blacklist del refresh)
// //         } catch (error) {
// //             console.error('Error during logout:', error);
// //             // Opcional: mostrar notificación al usuario
// //         } finally {
// //             navigate('/login');          // Redirige al login
// //         }
// //     };
// //
// //     return (
// //         <div className="bg-gray-800 text-white shadow-lg p-4">
// //             <div className="flex justify-between items-center">
// //                 <div className="flex space-x-6">
// //                     <Link
// //                         to="/cameras"
// //                         className="text-xl font-semibold hover:text-blue-500 transition-colors"
// //                     >
// //                         Cámaras
// //                     </Link>
// //                     <Link
// //                         to="/dashboard"
// //                         className="text-xl font-semibold hover:text-blue-500 transition-colors"
// //                     >
// //                         Dashboard
// //                     </Link>
// //                     <Link
// //                         to="/events"
// //                         className="text-xl font-semibold hover:text-blue-500 transition-colors"
// //                     >
// //                         Registro de Eventos
// //                     </Link>
// //                 </div>
// //
// //                 <div className="flex items-center space-x-3">
// //                     <span className="text-lg">Bienvenido, <strong>{userName}</strong></span>
// //                     <button className="text-sm text-blue-400 hover:text-blue-600 transition-colors" onClick={handleLogout}>
// //                         Cerrar sesión
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Navbar;
//
//
//
//
//
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { logoutUser } from '../api/auth';
// import { getUsername } from '../api/tokenService';
//
// const Navbar: React.FC = () => {
//     const navigate = useNavigate();
//
//     // Extraemos el username del token JWT
//     const userName = getUsername() || 'Usuario';
//
//     const handleLogout = async () => {
//         try {
//             await logoutUser();
//         } catch (error) {
//             console.error('Error during logout:', error);
//         } finally {
//             navigate('/login');
//         }
//     };
//
//     return (
//       <div className="bg-gray-800 text-white shadow-lg p-4">
//           <div className="flex justify-between items-center">
//               <div className="flex space-x-6">
//                   <Link to="/cameras" className="text-xl font-semibold hover:text-blue-500 transition-colors">
//                       Cámaras
//                   </Link>
//                   <Link to="/dashboard" className="text-xl font-semibold hover:text-blue-500 transition-colors">
//                       Dashboard
//                   </Link>
//                   <Link to="/events" className="text-xl font-semibold hover:text-blue-500 transition-colors">
//                       Registro de Eventos
//                   </Link>
//               </div>
//
//               <div className="flex items-center space-x-3">
//           <span className="text-lg">
//             Bienvenido, <strong>{userName}</strong>
//           </span>
//                   <button
//                     className="text-sm text-blue-400 hover:text-blue-600 transition-colors"
//                     onClick={handleLogout}
//                   >
//                       Cerrar sesión
//                   </button>
//               </div>
//           </div>
//       </div>
//     );
// };
//
// export default Navbar;


// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gray-800 text-white shadow-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/cameras" className="text-xl font-semibold hover:text-blue-500 transition-colors">
            Cámaras
          </Link>
          <Link to="/dashboard" className="text-xl font-semibold hover:text-blue-500 transition-colors">
            Dashboard
          </Link>
          <Link to="/events" className="text-xl font-semibold hover:text-blue-500 transition-colors">
            Registro de Eventos
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-lg">
            Bienvenido, <strong>{userName ?? 'Usuario'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-blue-400 hover:text-blue-600 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

