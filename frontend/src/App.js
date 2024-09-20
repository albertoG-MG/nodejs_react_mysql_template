import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
    const [estaAutenticado, setEstaAutenticado] = useState(() => {
        // Verifica si hay un token en localStorage al cargar el componente
        return localStorage.getItem('token') !== null;
    });

    const handleLogin = (token) => {
        localStorage.setItem('token', token); // Guarda el token en localStorage
        setEstaAutenticado(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token al cerrar sesión
        setEstaAutenticado(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={estaAutenticado ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to={estaAutenticado ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
}
