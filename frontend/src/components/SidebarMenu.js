//SidebarMenu.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../routes/Router';

export default function SidebarMenu({ isOpen }) {
    const [openSubmenu, setOpenSubmenu] = useState({});
    const location = useLocation();

    useEffect(() => {
    const currentPath = location.pathname;
    const submenuState = {};
    routes.forEach(route => {
    if (route.submenu) {
    submenuState[route.path] = currentPath.includes(route.path);
    }
    });
    setOpenSubmenu(submenuState);
    }, [location.pathname]);

    const toggleSubmenu = (path) => {
    setOpenSubmenu((prev) => ({ ...prev, [path]: !prev[path] }));
    };

    return (
    <>
        <nav className={`z-[9] bg-white shadow-lg h-full md:h-screen fixed top-[4.1rem] left-0 min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col overflow-auto transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full' } md:block`} role="navigation" aria-label="Menú de navegación">
            <ul className="mb-6 space-y-3 flex-1">
                {routes.map((route) => (
                <li key={route.path} className="group">
                    <Link to={route.path} className={`text-gray-600 hover:bg-gray-50 text-sm flex items-center rounded-md px-4 py-2 transition-all ${location.pathname===route.path ? 'text-indigo-600 bg-gray-50' : '' }`} onClick={route.submenu ? (e)=> { e.preventDefault(); toggleSubmenu(route.path); } : null}
                    role="menuitem"
                    aria-haspopup={route.submenu ? "true" : "false"}
                    aria-expanded={openSubmenu[route.path] || false}
                    tabIndex="0"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3" aria-hidden="true">
                        <path d={route.icon} />
                    </svg>
                    <span className="font-semibold">{route.label}</span>
                    {route.submenu && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`w-3 ml-auto -rotate-90 transition-transform duration-300 ${openSubmenu[route.path] ? 'rotate-0' : '' }`} viewBox="0 0 451.847 451.847" aria-hidden="true">
                        <path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" />
                    </svg>
                    )}
                    </Link>
                    {route.submenu && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu[route.path] ? 'max-h-full opacity-100' : 'max-h-0 opacity-0' }`}>
                        <ul className="space-y-2 pl-4 pb-6">
                            {route.submenu.map((subItem) => (
                            <li key={subItem.path}>
                                <Link to={subItem.path} className={`relative top-[2px] right-[2px] text-gray-600 hover:bg-gray-50 hover:text-indigo-600 text-sm flex items-center rounded-md px-4 py-2 transition-all ${location.pathname===subItem.path ? 'text-indigo-600 bg-gray-50' : '' }`} role="menuitem" tabIndex="0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3" aria-hidden="true">
                                    <path d={subItem.subicon} />
                                </svg>
                                <span className="font-semibold">{subItem.label}</span>
                                </Link>
                            </li>
                            ))}
                        </ul>
                    </div>
                    )}
                </li>
                ))}
            </ul>
        </nav>
    </>
    );
}