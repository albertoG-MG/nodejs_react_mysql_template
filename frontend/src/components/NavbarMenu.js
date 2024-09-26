import React, {useState, useEffect, useRef} from 'react';

export default function NavbarMenu({ onToggleSidebar, onLogout }) {
  const [Opciones, setOpciones] = useState(false);
  const menuOpcionesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpcionesRef.current && !menuOpcionesRef.current.contains(event.target)) {
        setOpciones(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
 

  return (
    <>
    <div className="bg-white fixed top-0 w-full z-10">
      <div className="w-full border-b-2 border-gray-200">
        <div className="flex justify-between items-center mx-auto h-16 px-4">
          <button onClick={onToggleSidebar}  name="hamburger" className="px-2 md:hidden">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
          </button>
          <div>
            <span className="block max-w-xs text-2xl font-bold text-black font-inter">
              INTRANET
            </span>
          </div>
          <div className="lg:block mr-auto ml-5 hidden relative max-w-xs">
            <p className="pl-3 items-center flex absolute inset-y-0 left-0 pointer-events-none">
              <span className="justify-center items-center flex">
                <span className="justify-center items-center flex">
                  <span className="items-center justify-center flex">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0
                      11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                </span>
              </span>
            </p>
            <input placeholder="Type to search" type="search" className="border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm w-full rounded-lg pt-2 pb-2 pl-10 px-3 py-2" />
          </div>
          <div className="md:space-x-6 justify-end items-center ml-auto flex space-x-3">
            <div className="relative cursor-pointer">
              <p className="pt-1 pr-1 pb-1 pl-1 bg-white text-gray-700 rounded-full transition-all duration-200 hover:text-gray-900 focus:outline-none hover:bg-gray-100">
                <span className="justify-center items-center flex">
                  <span className="justify-center items-center flex">
                    <span className="items-center justify-center flex">
                      <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4
                        0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6
                        0H9" /></svg>
                    </span>
                  </span>
                </span>
              </p>
              <p className="px-1.5 py-0.5 font-semibold text-xs items-center bg-indigo-600 text-white rounded-full inline-flex absolute -top-px -right-1">2</p>
            </div>
            <div className="relative"  ref={menuOpcionesRef}>
              <div className="block text-center cursor-pointer" onClick={() => setOpciones(!Opciones)}>
                <img src="https://static01.nyt.com/images/2019/11/08/world/08quebec/08quebec-superJumbo.jpg" className="object-cover btn- h-9 w-9 rounded-full mr-2 bg-gray-300" alt="" />
              </div>
              <div className={`absolute shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none bg-white rounded-md right-0 w-48 py-2 z-10 ${Opciones ? 'block' : 'hidden'} `}>
                <span className="block font-semibold hover:bg-gray-50 px-3 py-2 cursor-pointer">Mi perfil</span>
                <span className="block font-semibold hover:bg-gray-50 px-3 py-2 cursor-pointer" onClick={onLogout}>Cerrar sesión</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
  
  
