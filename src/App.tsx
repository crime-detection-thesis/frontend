import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectSurveillanceCenter from './pages/SelectSurveillanceCenter';
import CreateSurveillanceCenter from './pages/CreateSurveillanceCenter';
import Cameras from './pages/Cameras';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/select-surveillance-center" element={<SelectSurveillanceCenter />} />
                <Route path="/create-surveillance-center" element={<CreateSurveillanceCenter />} />

                <Route path="/cameras" element={<Cameras />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<Events />} />
            </Routes>
        </Router>
    );
};

export default App;
