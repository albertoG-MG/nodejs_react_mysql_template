import React, {useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarMenu({ isOpen }) {
  const [abiertoUsuarios, setabiertoUsuarios] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setabiertoUsuarios(location.pathname.includes('/usuarios'));
  }, [location.pathname]);

  const abrirSubmenuUsuarios = () => {
    setabiertoUsuarios(!abiertoUsuarios);
  };

  return (
    <>
    <nav className={`z-[9] bg-white shadow-lg h-full md:h-screen fixed top-[4.1rem] left-0 min-w-[260px] py-6 px-4 font-[sans-serif] flex flex-col overflow-auto transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'} md:block`} role="navigation" aria-label="Menú de navegación">
        {/* 
        <div className="flex flex-wrap items-center cursor-pointer">
            <div className="relative">
                <img src="https://readymadeui.com/profile_2.webp" className="w-12 h-12 p-1 rounded-xl border border-gray-300" alt="Profile" />
            </div>
            <div className="ml-6">
                <p className="text-xs text-gray-300">Hello</p>
                <h6 className="text-sm text-white mt-1">John Doe</h6>
            </div>
        </div>
        <hr className="border-gray-500 my-8" />
        */}
        <ul className="mb-6 space-y-3 flex-1">
            <li>
                <Link to="/" className={`text-gray-600 hover:bg-gray-50 hover:text-indigo-600 text-sm flex items-center rounded-md px-4 py-2 transition-all ${location.pathname === '/' ? 'text-indigo-600 bg-gray-50' : ''}`} role="menuitem" tabIndex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="font-semibold">Dashboard</span>
                </Link>
            </li>
            <li className="group">
                <a href="#" className="text-gray-600 hover:bg-gray-50 text-sm flex items-center rounded-md px-4 py-2 transition-all" onClick={abrirSubmenuUsuarios} role="menuitem" aria-haspopup="true" aria-expanded={abiertoUsuarios} tabIndex="0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <span className="font-semibold">Usuarios</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`w-3 ml-auto -rotate-90 transition-transform duration-300 ${abiertoUsuarios ? 'rotate-0' : ''}`} viewBox="0 0 451.847 451.847" aria-hidden="true">
                        <path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" />
                    </svg>
                </a>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${abiertoUsuarios ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-2 pl-4 pb-6">
                        <li>
                            <Link to="/usuarios/consulta" className={`relative top-[2px] right-[2px] text-gray-600 hover:bg-gray-50 hover:text-indigo-600 text-sm flex items-center rounded-md px-4 py-2 transition-all ${location.pathname === '/usuarios/consulta' ? 'text-indigo-600 bg-gray-50' : ''}`} role="menuitem" tabIndex="0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <span className="font-semibold">Consulta</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/usuarios/crear" className={`relative top-[2px] right-[2px] text-gray-600 hover:bg-gray-50 hover:text-indigo-600 text-sm flex items-center rounded-md px-4 py-2 transition-all ${location.pathname === '/usuarios/crear' ? 'text-indigo-600 bg-gray-50' : ''}`} role="menuitem" tabIndex="0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>
                                <span className="font-semibold">Crear usuarios</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </nav>
    </>
  );
}