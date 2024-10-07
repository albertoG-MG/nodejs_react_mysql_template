import React, { useEffect, useState } from 'react';
import { fetchSubroles } from '../../services/usuarios/crear_usuarios/obtener_subroles/SubrolService';

const SubrolesComponent = ({ selectedRoleId }) => {
  const [subroles, setSubRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const getSubRoles = async () => {
      if (!selectedRoleId) return;
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSubroles(token, selectedRoleId);
        setSubRoles(data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
            setSubRoles([]);
            setError('No hay subroles disponibles para este rol');
        }else{
            setError('Error al cargar subroles: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getSubRoles();
  }, [selectedRoleId]);

  if (loading) return  <div className="grid grid-cols-1 bg-slate-100 rounded-md p-4 mt-5 mx-7"><p>Cargando subroles...</p></div>;            
  if (error) return <div className="grid grid-cols-1 bg-slate-100 rounded-md p-4 mt-5 mx-7"><p>{ error }</p></div>;    

  return (
    <div className="grid grid-cols-1 mt-5 mx-7">
        <label className="text-[#64748b] font-semibold mb-2">Subrol</label>
        <div className="group flex">
            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 8C6 5.79 7.79 4 10 4S14 5.79 14 8 12.21 12 10 12 6 10.21 6 8M12 18.2C12 17.24 12.5 16.34 13.2 15.74V15.5C13.2 15.11 13.27 14.74 13.38 14.38C12.35 14.14 11.21 14 10 14C5.58 14 2 15.79 2 18V20H12V18.2M22 18.3V21.8C22 22.4 21.4 23 20.7 23H15.2C14.6 23 14 22.4 14 21.7V18.2C14 17.6 14.6 17 15.2 17V15.5C15.2 14.1 16.6 13 18 13C19.4 13 20.8 14.1 20.8 15.5V17C21.4 17 22 17.6 22 18.3M19.5 15.5C19.5 14.7 18.8 14.2 18 14.2C17.2 14.2 16.5 14.7 16.5 15.5V17H19.5V15.5Z"></path>
                </svg>
            </div>
            <select className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600" name="subrol">
                <option value="">Sin subrol</option>
                {subroles.map(subrol => (
                    <option key={subrol.id} value={subrol.id}>{subrol.subrol_nombre}</option>
                ))}
            </select>
        </div>
    </div>
  );
};

export default SubrolesComponent;