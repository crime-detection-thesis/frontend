// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { AuthProvider } from './contexts/AuthContext'
// import { RegistrationProvider } from './contexts/RegistrationContext'
//
// createRoot(document.getElementById('root')!).render(
//   // <StrictMode>
//   //   <App />
//   // </StrictMode>,
//   <StrictMode>
//     <AuthProvider>
//       <RegistrationProvider>
//         <App />
//       </RegistrationProvider>
//     </AuthProvider>
//   </StrictMode>
// )




// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <RegistrationProvider>
          <App />
        </RegistrationProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
);
