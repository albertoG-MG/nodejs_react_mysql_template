import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
    const [estaAutenticado, setEstaAutenticado] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={estaAutenticado ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login onLogin={() => setEstaAutenticado(true)} />} />
                {/* Redirige al login */}
                <Route path="*" element={<Navigate to={estaAutenticado ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
}
