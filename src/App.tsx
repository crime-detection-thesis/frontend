import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectSurveillanceCenter from './pages/SelectSurveillanceCenter';
import CreateSurveillanceCenter from './pages/CreateSurveillanceCenter';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/select-surveillance-center" element={<SelectSurveillanceCenter />} />
                <Route path="/create-surveillance-center" element={<CreateSurveillanceCenter />} />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Routes>
        </Router>
    );
};

export default App;
