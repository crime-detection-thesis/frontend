import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectSurveillanceCenter from './pages/SelectSurveillanceCenter';
import CreateSurveillanceCenter from './pages/CreateSurveillanceCenter';
import Cameras from './pages/Cameras';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';

const App: React.FC = () => (
  <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-surveillance-center" element={<SelectSurveillanceCenter />} />
      <Route path="/create-surveillance-center" element={<CreateSurveillanceCenter />} />
      <Route path="/camaras" element={<Cameras />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/alertas" element={<Events />} />
  </Routes>
);

export default App;
