import React, { useState, useEffect, useRef  } from 'react';
import useApiChecarUsuario from "../../services/usuarios/form_services/validacion/ApiChecarUsuario";
import useApiChecarPassword from "../../services/usuarios/form_services/validacion/ApiChecarPassword";
import useApiChecarCorreo from "../../services/usuarios/form_services/validacion/ApiChecarCorreo";
import ObtenerRoles from '../../components/form_components/ObtenerRoles';
import ObtenerSubRoles from '../../components/form_components/ObtenerSubRoles';
import ObtenerDepartamentos from '../../components/form_components/ObtenerDepartamentos';

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

    //Guarda el rol seleccionado
    const [selectedRoleId, setSelectedRoleId] = useState('');

    //Estado para las imágenes
    const [imagePreview, setImagePreview] = useState(null);

    //Función debounce personalizada
    const debounceRef = useRef(null);

    //Función que actualiza el rol
    const handleRoleSelect = (roleId) => {
        setSelectedRoleId(roleId);
    };

    const [cargandoform, setCargandoform] = useState(false);

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

             // Crear una URL de objeto para la vista previa de la imagen
             const previewUrl = URL.createObjectURL(selectedFile);
             setImagePreview(previewUrl);
        } else {
            // Actualiza el estado del campo
            setCampos((prevCampos) => ({
                ...prevCampos,
                [name]: value
            }));

            const errores = validar({ ...Campos, [name]: value }, name);
            setErrores(errores);
            

            const token = localStorage.getItem('token');
            try {
                if (name === 'username') {
                    clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => verificarUsuario(value), 500);

                } else if (name === 'password') {
                    clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => verificarPassword(value), 500);
                } else if (name === 'correo') {
                    clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => verificarCorreo(value), 500);
                }
            } catch (err) {
                console.error('Error en la llamada a la API:', err);
                setErrores((prev) => ({ ...prev, username: '', password: '', correo: '' }));
            }
        }
    };

    const verificarUsuario = async (username) => {
        const token = localStorage.getItem('token');
        try {
            const { success, message } = await useApiChecarUsuario(token, { username });
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

    const verificarPassword = async (password) => {
        const token = localStorage.getItem('token');
        try {
            const { success, message } = await useApiChecarPassword(token, { password });
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

    const verificarCorreo = async (correo) => {
        const token = localStorage.getItem('token');
        try {
            const { success, message } = await useApiChecarCorreo(token, { correo });
            setErrores((prev) => ({
                ...prev,
                correo: success ? prev.correo : message
            }));
        } catch (err) {
            console.error('Error en la llamada a la API:', err);
            setErrores((prev) => ({
                ...prev,
                correo: prev.correo || 'Error al verificar el correo. Inténtalo nuevamente.'
            }));
        }
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

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
    
        // Validar la contraseña
        if(campo === "password" || esEnvio){
            if (!Campos.password) {
                errores.password = 'La contraseña es requerida.';
            } else if (Campos.password && Campos.password.length < 8) {
                errores.password = 'La contraseña debe de tener como mínimo 8 caracteres.';
            } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*])[a-zA-Z0-9!@#$%&*]+$/.test(Campos.password)) {
                errores.password = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%&*).';
            }
        }
    
        // Validar confirmación de contraseña
        if(campo === "confirmpassword" || esEnvio){
            if (!Campos.confirmpassword) {
                errores.confirmpassword = 'La confirmación de la contraseña es requerida.';
            } else if (Campos.password !== Campos.confirmpassword) {
                errores.confirmpassword = 'La confirmación de la contraseña debe ser igual a la contraseña.';
            }
        }
    
        // Validar nombre
        if(campo === "nombre" || esEnvio){
            if (!Campos.nombre) {
                errores.nombre = 'El nombre es requerido.';
            } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.nombre)) {
                errores.nombre = 'El nombre solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
            }
        }
    
        // Validar apellido paterno
        if(campo === "apellido_pat" || esEnvio){
            if (!Campos.apellido_pat) {
                errores.apellido_pat = 'El apellido paterno es requerido.';
            } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.apellido_pat)) {
                errores.apellido_pat = 'El apellido paterno solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
            }
        }
    
        // Validar apellido materno
        if(campo === "apellido_pat" || esEnvio){
            if (!Campos.apellido_mat) {
                errores.apellido_mat = 'El apellido materno es requerido.';
            } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.apellido_mat)) {
                errores.apellido_mat = 'El apellido materno solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
            }
        }
    
        // Validar correo
        if(campo === "correo" || esEnvio){
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

        const erroresEnTiempoReal = { ...Errores };
        const erroresDeEnvio = validar(Campos, "", true);

        const erroresCombinados = { ...erroresEnTiempoReal, ...erroresDeEnvio };
        setErrores(erroresCombinados);

        if (Object.keys(erroresCombinados ).length === 0) {
            console.log('Formulario enviado con éxito', Campos);
            setCargandoform(true);

        } else {
            console.log('Hay errores en el formulario', erroresCombinados);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-semibold sm:text-5xl lg:text-6xl mb-5 mx-7">Crear Usuario</h1>
            <form onSubmit={manejarEnvio}>
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

                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Ingresa la confirmación de la contraseña</label>
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
                    <label className="text-[#64748b] font-semibold mb-2">Ingresa el nombre</label>
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
                    <label className="text-[#64748b] font-semibold mb-2">Ingresa el apellido paterno</label>
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
                    <label className="text-[#64748b] font-semibold mb-2">Ingresa el apellido materno</label>
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
                    <label className="text-[#64748b] font-semibold mb-2">Ingresa el correo electrónico</label>
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
                <ObtenerRoles onRoleSelect={handleRoleSelect}/>
                <ObtenerSubRoles selectedRoleId={selectedRoleId} />
                <ObtenerDepartamentos selectedRoleId={selectedRoleId} />
                {imagePreview && (
                    <div className="grid grid-cols-1 mt-5 mx-7">
                        <h3>Previsualización de la imagen:</h3>
                        <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                )}
                <div className="grid grid-cols-1 mt-5 mx-7">
                    <label className="text-[#64748b] font-semibold mb-2">Foto de Perfil (opcional)</label>
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
                    {cargandoform ? (
                        <button disabled type="button" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5 inline-flex items-center">
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>
                        Cargando...
                        </button>
                    ) : (
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
                            type="submit"
                        >
                            Crear Usuario
                        </button>
                    )}
                </div>
            </form>
        </>
    );
}
