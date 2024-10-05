import React, { useState } from 'react';
import useApiChecarUsuario from "../../services/usuarios/crear_usuarios/validacion/ApiChecarUsuario";
import useApiChecarPassword from "../../services/usuarios/crear_usuarios/validacion/ApiChecarPassword";
import useApiChecarCorreo from "../../services/usuarios/crear_usuarios/validacion/ApiChecarCorreo";
import ObtenerRoles from '../../components/crear_usuarios/ObtenerRoles';

export default function Crearusuario() {
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

    // Definición del estado de los campos, si contiene errores o no.
    const [Errores, setErrores] = useState({});

    // Función que actualiza el estado de los campos en tiempo real
    const manejarCambio = async (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const selectedFile = files[0];
            const validExtensions = ['jpg', 'jpeg', 'png'];
            const maxSize = 10 * 1024 * 1024; // 10MB en bytes
            let error = '';

            // Validar la extensión y el tamaño
            if (selectedFile) {
                const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

                if (!validExtensions.includes(fileExtension)) {
                    error = 'Solo se permiten archivos con las extensiones: jpg, jpeg, png.';
                } else if (selectedFile.size > maxSize) {
                    error = 'El tamaño del archivo debe ser menor a 10MB.';
                }
            }

            // Actualiza el estado y los errores solo si no hay errores
            if (error) {
                setErrores((prevErrores) => ({
                    ...prevErrores,
                    [name]: error
                }));
            } else {
                setCampos((prevCampos) => ({
                    ...prevCampos,
                    [name]: selectedFile
                }));
                setErrores((prevErrores) => ({
                    ...prevErrores,
                    [name]: ''
                }));
            }
        } else {
            // Actualiza el estado del campo
            setCampos((prevCampos) => ({
                ...prevCampos,
                [name]: value
            }));

            const errores = validar({ ...Campos, [name]: value });
            setErrores(errores);
            

            const token = localStorage.getItem('token');
            try {
                if (name === 'username') {
                    // Verifica si el nombre de usuario ya existe
                    const { success, message } = await useApiChecarUsuario(token, { username: value });

                    if (!success) {
                        setErrores((prev) => ({ ...prev, username: message }));
                    } else {
                        setErrores((prev) => ({ ...prev, username: '' }));
                    }

                } else if (name === 'password') {
                    // Verifica si la contraseña está en la blacklist
                    const { success, message } = await useApiChecarPassword(token, { password: value });

                    if (!success) {
                        setErrores((prev) => ({ ...prev, password: message }));
                    } else {
                        setErrores((prev) => ({ ...prev, password: '' }));
                    }
                } else if (name === 'correo') {
                    // Verifica si el correo está repetido
                    const { success, message } = await useApiChecarCorreo(token, { correo: value });

                    if (!success) {
                        setErrores((prev) => ({ ...prev, correo: message }));
                    } else {
                        setErrores((prev) => ({ ...prev, correo: '' }));
                    }
                }
            } catch (err) {
                console.error('Error en la llamada a la API:', err);
                setErrores((prev) => ({ ...prev, username: '', password: '', correo: '' }));
            }
        }
    };

    const validar = (Campos) => {
        const errores = {};

        if (Campos.username !== "") {
            if (!Campos.username) {
                errores.username = 'El usuario es requerido.';
            } else if (Campos.username.length < 5) {
                errores.username = 'El usuario debe de tener como mínimo 5 carácteres.';
            } else if (!/^(?=[a-zA-Z0-9._]{4,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(Campos.username)) {
                errores.username = 'El usuario debe de tener entre 4 y 30 caracteres, sin puntos o guiones bajos consecutivos, y no puede empezar o terminar con un punto o guion bajo.';
            }
        }

        if (Campos.password !== "") {
            if (!Campos.password) {
                errores.password = 'La contraseña es requerida.';
            } else if (Campos.password.length < 8) {
                errores.password = 'La contraseña debe de tener como mínimo 8 carácteres.';
            } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*])[a-zA-Z0-9!@#$%&*]+$/.test(Campos.password)) {
                errores.password = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%&*).';
            }
        }

        if (Campos.confirmpassword !== "") {
            if (!Campos.confirmpassword) {
                errores.confirmpassword = 'La confirmación de la contraseña es requerida.';
            } else if (Campos.password !== Campos.confirmpassword) {
                errores.confirmpassword = 'La confirmación de la contraseña debe de ser igual a la contraseña.';
            }
        }

        if (Campos.nombre !== "") {
            if (!Campos.nombre) {
                errores.nombre = 'El nombre es requerido.';
            } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.nombre)) {
                errores.nombre = 'El nombre solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
            }
        }

        if (Campos.apellido_pat !== "") {
            if (!Campos.apellido_pat) {
                errores.apellido_pat = 'El apellido paterno es requerido.';
            } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.apellido_pat)) {
                errores.apellido_pat = 'El apellido paterno solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
            }
        }

        if (Campos.apellido_mat !== "") {
            if (!Campos.apellido_mat) {
                errores.apellido_mat = 'El apellido materno es requerido.';
            } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.apellido_mat)) {
                errores.apellido_mat = 'El apellido materno solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
            }
        }

        if (Campos.correo !== "") {
            if (!Campos.correo) {
                errores.correo = 'El correo es requerido.';
            } else if (!/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i.test(Campos.correo)) {
                errores.correo = 'Formato de correo electrónico no válido. Por favor, introduce una dirección de correo electrónico válida.';
            }
        }

        return errores;
    };

    const manejarEnvio = (e) => {
        e.preventDefault();

        const errores = validar(Campos);
        setErrores(errores);

        if (Object.keys(errores).length === 0) {
            console.log('Formulario enviado con éxito', Campos);
            // Aquí puedes manejar la lógica para enviar el formulario a tu API
        }
    };

    return (
        <>
            <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl mb-5 mx-7">Crear Usuario</h1>
            <form onSubmit={manejarEnvio}>
                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Ingrese su usuario</label>
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
                    <label className="text-[#64748b] font-semibold mb-2">Ingrese su contraseña</label>
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

                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Confirma tu contraseña</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"></path>
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="password"
                            name="confirmpassword"
                            placeholder="Confirma tu contraseña"
                            value={Campos.confirmpassword}
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.confirmpassword && <p className="text-red-500">{Errores.confirmpassword}</p>}
                </div>

                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Nombre</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29"></path>
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={Campos.nombre}
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.nombre && <p className="text-red-500">{Errores.nombre}</p>}
                </div>

                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Apellido Paterno</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29"></path>
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="text"
                            name="apellido_pat"
                            placeholder="Apellido Paterno"
                            value={Campos.apellido_pat}
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.apellido_pat && <p className="text-red-500">{Errores.apellido_pat}</p>}
                </div>

                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Apellido Materno</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29"></path>
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="text"
                            name="apellido_mat"
                            placeholder="Apellido Materno"
                            value={Campos.apellido_mat}
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.apellido_mat && <p className="text-red-500">{Errores.apellido_mat}</p>}
                </div>

                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Correo Electrónico</label>
                    <div className="group flex">
                        <div className="w-10 z-[1] pl-1 text-center pointer-events-none flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"></path>
                            </svg>
                        </div>
                        <input
                            className="w-full -ml-10 pl-10 py-2 h-11 border rounded-md border-[#d1d5db] focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                            type="email"
                            name="correo"
                            placeholder="Correo Electrónico"
                            value={Campos.correo}
                            onChange={manejarCambio}
                        />
                    </div>
                    {Errores.correo && <p className="text-red-500">{Errores.correo}</p>}
                </div>
                <ObtenerRoles />
                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Foto de Perfil</label>
                    <input
                        type="file"
                        name="foto"
                        accept="image/jpeg,image/png"
                        onChange={manejarCambio}
                    />
                    {Errores.foto && <p className="text-red-500">{Errores.foto}</p>}
                </div>
                <div class="mt-8 h-px bg-slate-200"></div>
                <div className="text-right">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
                        type="submit"
                    >
                        Crear Usuario
                    </button>
                </div>
            </form>
        </>
    );
}
