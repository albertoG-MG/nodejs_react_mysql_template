import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NavbarMenu from './components/NavbarMenu';
import SidebarMenu from './components/SidebarMenu';

export default function App() {
    const [estaAutenticado, setEstaAutenticado] = useState(() => {
        // Verifica si hay un token en localStorage al cargar el componente
        return localStorage.getItem('token') !== null;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleLogin = (token) => {
        localStorage.setItem('token', token); // Guarda el token en localStorage
        setEstaAutenticado(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token al cerrar sesión
        setEstaAutenticado(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        if (window.innerWidth < 768) { // 768px es el punto de ruptura para md
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true); // O mantenerlo abierto
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        // Llamar a la función para establecer el estado inicial
        handleResize();

        // Limpiar el evento al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const shouldShowOverlay = windowWidth < 768 && isSidebarOpen;

    return (
        <Router>
            {estaAutenticado ? (
                <>
                    <NavbarMenu onToggleSidebar={toggleSidebar} onLogout={handleLogout}/>
                    <SidebarMenu isOpen={isSidebarOpen} />
                    <div className={`min-h-screen transition-all duration-300 ${shouldShowOverlay ? 'bg-black opacity-50' : ''}`}>
                        <div className="relative top-[58px] py-4 px-8">
                            <Routes>
                                    <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
                                    <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                    </div>   
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </Router>
    );    
}
