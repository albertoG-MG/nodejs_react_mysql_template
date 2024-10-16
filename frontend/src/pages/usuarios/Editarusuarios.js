import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import useApiChecarUsuarioBack from '../../services/usuarios/useApiChecarUsuarioBack';
import useApiChecarEditUsuario from '../../services/usuarios/form_services/validacion/useApiChecarEditUsuario';
import useApiChecarEditPassword from '../../services/usuarios/form_services/validacion/useApiChecarEditPassword';
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
    const [Errores, setErrores] = useState({});
    const debounceRef = useRef(null);

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


    const manejarCambio = async (e) => {
        const { name, value } = e.target;
        setCampos((prevCampos) => ({
            ...prevCampos,
            [name]: value
        }));

        const erroresActuales = { ...Errores };

        const nuevoError = validar({ ...Campos, [name]: value }, name);

        if (nuevoError[name]) {
            erroresActuales[name] = nuevoError[name];
        } else {
            erroresActuales[name] = ''; 
        }

        setErrores(erroresActuales);

        try {
            if (name === 'username') {
                clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => verificarUsuario(value, id), 500);

            } else if(name === 'password'){
                clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => verificarPassword(value, id), 500);
            }
        } catch (err) {
            console.error('Error en la llamada a la API:', err);
            setErrores((prev) => ({ ...prev, username: '', password: ''}));
        }
    }

    const verificarUsuario = async (username, id) => {
        try {
            const { success, message } = await useApiChecarEditUsuario(token, { username }, id);
            setErrores((prev) => ({
                ...prev,
                username: success ? prev.username : message
            }));
        } catch (err) {
            console.error('Error en la llamada a la API:', err);
            setErrores((prev) => ({
                ...prev,
                username: prev.username || 'Error al verificar el usuario. Inténtalo nuevamente.'
            }));
        }
    };

    const verificarPassword = async (password, id) => {
        try {
            const { success, message } = await useApiChecarEditPassword(token, { password }, id);
            setErrores((prev) => ({
                ...prev,
                password: success ? prev.password : message
            }));
        } catch (err) {
            console.error('Error en la llamada a la API:', err);
            setErrores((prev) => ({
                ...prev,
                password: prev.password || 'Error al verificar la contraseña. Inténtalo nuevamente.'
            }));
        }
    };

    const validar = (Campos, campo = "", esEnvio = false) => {
        const errores = {};
    
        // Validar el usuario
        if(campo === "username" || esEnvio){
            if (!Campos.username) {
                errores.username = 'El usuario es requerido.';
            } else if (Campos.username && Campos.username.length < 5) {
                errores.username = 'El usuario debe de tener como mínimo 5 caracteres.';
            } else if (!/^(?=[a-zA-Z0-9._]{4,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(Campos.username)) {
                errores.username = 'El usuario debe de tener entre 4 y 30 caracteres, sin puntos o guiones bajos consecutivos, y no puede empezar o terminar con un punto o guion bajo.';
            }
        }

        if(campo === "password" || esEnvio){
            if (!Campos.password) {
                errores.password = 'La contraseña es requerida.';
            } else if (Campos.password && Campos.password.length < 8) {
                errores.password = 'La contraseña debe de tener como mínimo 8 caracteres.';
            } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*])[a-zA-Z0-9!@#$%&*]+$/.test(Campos.password)) {
                errores.password = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%&*).';
            }
        }
    
        return errores;
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);
    

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
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.username && <p className="text-red-500">{Errores.username}</p>}
                </div>
                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Ingrese la contraseña</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"></path>
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={Campos.password}
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.password && <p className="text-red-500">{Errores.password}</p>}
                </div>
            </form>
        </>
    );
}
