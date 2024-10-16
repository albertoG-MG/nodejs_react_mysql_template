import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import useApiChecarUsuarioBack from '../../services/usuarios/useApiChecarUsuarioBack';
import Swal from 'sweetalert2';

export default function EditarUsuarios() {

    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Definición de cada uno de los campos del formulario
    const [Campos, setCampos] = useState({
        username: '',
        password: '',
        confirmpassword: '',
        nombre: '',
        apellido_pat: '',
        apellido_mat: '',
        correo: '',
        rol: '',
        subrol: '',
        departamento: '',
        foto: null
    });

    //Traer valores de la base de datos
    const checarUserDatos = async () => {
        const { success, message, getusuarioxid } = await useApiChecarUsuarioBack(token, id);

        // Redirigir al dashboard si el usuario no existe
        if (!success) {
            const result = await Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
    
            if (result.isConfirmed) {
                navigate('/');
            }
        }else {
            setCampos({
                username: getusuarioxid.username,
                password: '',
                confirmpassword: '',
                nombre: getusuarioxid.nombre,
                apellido_pat: getusuarioxid.apellido_pat,
                apellido_mat: getusuarioxid.apellido_mat,
                correo: getusuarioxid.correo,
                rol: getusuarioxid.roles_id,
                subrol: getusuarioxid.subrol_id,
                departamento: getusuarioxid.departamento_id,
                foto: getusuarioxid.foto_identificador
            });
        }
    };

    useEffect(() => {
        checarUserDatos();
    }, [id]);


    

    return (
        <>
            <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl mb-5 mx-7">Editar Usuario</h1>
            <form>
                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Ingrese el usuario</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="text"
                            name="username"
                            placeholder="Usuario"
                            value={Campos.username}
                            onChange={(e) => setCampos({ ...Campos, username: e.target.value })}
                        />
                    </div>
                </div>
                
            </form>
        </>
    );
}
