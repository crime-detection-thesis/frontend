import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import SelectSurveillanceCenter from './pages/SelectSurveillanceCenter';
import CreateSurveillanceCenter from './pages/CreateSurveillanceCenter';
import Cameras from './pages/Cameras';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import { PrivateRoute } from './components/PrivateRoute';

const App: React.FC = () => {
  const { userId, isInitializing } = useAuth();

  if (isInitializing) return null;

  return (
    <Routes>
      <Route
        path="/"
        element={
          userId
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-surveillance-center" element={<SelectSurveillanceCenter />} />
      <Route path="/create-surveillance-center" element={<CreateSurveillanceCenter />} /> 

      <Route
        path="/camaras"
        element={
          <PrivateRoute>
            <Cameras />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/alertas"
        element={
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
