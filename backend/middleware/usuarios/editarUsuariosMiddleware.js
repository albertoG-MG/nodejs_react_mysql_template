const userModel = require('../../models/userModel');
const rolModel = require('../../models/rolModel');
const subrolModel = require('../../models/subrolModel');
const user_password_service = require('../../services/validacion/validationCheckEditPassword');
const departamentos_service = require('../../services/obtener_departamento_rol_usuario/departamentoService');
const { quitarAcentos } = require('../../utils/textUtils');

const validateEditUserData = async (req, res, next) => {
    const { id } = req.params;
    const Campos = req.body;
    const foto = req.file; 
    const errores = {};

    // Validar el usuario
    if (!Campos.username) {
        errores.username = 'El usuario es requerido.';
    } else if (Campos.username && Campos.username.length < 5) {
        errores.username = 'El usuario debe de tener como mínimo 5 caracteres.';
    } else if (!/^(?=[a-zA-Z0-9._]{4,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(Campos.username)) {
        errores.username = 'El usuario debe de tener entre 4 y 30 caracteres, sin puntos o guiones bajos consecutivos, y no puede empezar o terminar con un punto o guion bajo.';
    }else{
        const check_user= await userModel.checarEditUsuario(Campos.username, id);
        if(check_user){
            errores.username = 'El usuario está repetido'
        }
        req.body.username = Campos.username.toLowerCase();
    }

    // Validar la contraseña
    if (Campos.password) {
        if (Campos.password.length < 8) {
            errores.password = 'La contraseña debe de tener como mínimo 8 caracteres.';
        } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*])[a-zA-Z0-9!@#$%&*]+$/.test(Campos.password)) {
            errores.password = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%&*).';
        } else {
            const checar_password = await user_password_service.validationCheckEditPassword(id, Campos.password);
            if (checar_password) {
                errores.password = checar_password.message;
            }
        }
    }

    // Validar confirmación de contraseña
    if (Campos.password && !Campos.confirmpassword) {
        errores.confirmpassword = 'La confirmación de la contraseña es requerida si se proporciona una nueva contraseña.';
    } else if (Campos.password && Campos.password !== Campos.confirmpassword) {
        errores.confirmpassword = 'La confirmación de la contraseña debe ser igual a la contraseña.';
    }


    // Validar nombre
    if (!Campos.nombre) {
        errores.nombre = 'El nombre es requerido.';
    } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.nombre)) {
        errores.nombre = 'El nombre solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
    }else{
        Campos.nombre = Campos.nombre.toUpperCase();
        Campos.nombre = quitarAcentos(Campos.nombre);
        req.body.nombre = Campos.nombre;
    }

    // Validar apellido paterno
    if (!Campos.apellido_pat) {
        errores.apellido_pat = 'El apellido paterno es requerido.';
    } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.apellido_pat)) {
        errores.apellido_pat = 'El apellido paterno solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
    }else{
        Campos.apellido_pat = Campos.apellido_pat.toUpperCase();
        Campos.apellido_pat = quitarAcentos(Campos.apellido_pat);
        req.body.apellido_pat = Campos.apellido_pat;
    }

    // Validar apellido materno
    if (!Campos.apellido_mat) {
        errores.apellido_mat = 'El apellido materno es requerido.';
    } else if (!/^[a-zA-Z\u00C0-\u00FF]+(?:[-'\s][a-zA-Z\u00C0-\u00FF]+)*$/.test(Campos.apellido_mat)) {
        errores.apellido_mat = 'El apellido materno solo puede contener letras y caracteres acentuados, y los espacios o guiones deben estar correctamente posicionados.';
    }else{
        Campos.apellido_mat = Campos.apellido_mat.toUpperCase();
        Campos.apellido_mat = quitarAcentos(Campos.apellido_mat);
        req.body.apellido_mat = Campos.apellido_mat;
    }

    // Validar correo
    if (!Campos.correo) {
        errores.correo = 'El correo es requerido.';
    } else if (!/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i.test(Campos.correo)) {
        errores.correo = 'Formato de correo electrónico no válido. Por favor, introduce una dirección de correo electrónico válida.';
    }else {
        const checar_correo = await userModel.checarEditCorreo(id, Campos.correo);
        if(checar_correo){
            errores.correo = 'El correo está repetido; por favor, escoga otro.';
        }
    }

    if(Campos.rol){
        try {
            const obtener_roles = await rolModel.getRolesxUsuarios();

            if(obtener_roles.length > 0){
                Campos.rol = Number(Campos.rol);
                const rolEncontrado = obtener_roles.find(rol => rol.id === Campos.rol);
                if(!rolEncontrado){
                    errores.rol = 'El rol no existe';
                }
                req.body.rol = Campos.rol;
            }else{
                errores.rol = 'No hay roles registrados en el sistema';
            }
        }catch(error){
            console.error("Problemas al realizar la consulta para el rol" +error);
            return res.status(400).json({ success: false, error});
        }

        if(Campos.subrol){
            try{
                const check_subrol = await subrolModel.getSubrolesxRolxUsuarios(Campos.rol);
                if(check_subrol.length > 0){
                    Campos.subrol = Number(Campos.subrol);
                    const subrolEncontrado = check_subrol.find(subrol => subrol.id === Campos.subrol);
                    if(!subrolEncontrado){
                        errores.subrol = 'Este subrol no está registrado en el sistema';
                    }
                    req.body.subrol = Campos.subrol;
                }
            }catch(error){
                console.error("Problemas al realizar la consulta para el subrol" +error);
                return res.status(400).json({ success: false, error});
            }
        }else{
            req.body.subrol = null;
        }

        if(Campos.departamento){
            try{
                const get_departamento = await departamentos_service.getDepartamentoxRolxUsuarios(Campos.rol);
                if(get_departamento.length > 0){
                    Campos.departamento = Number(Campos.departamento);
                    const departamentoEncontrado = get_departamento.find(departamento => departamento.id === Campos.departamento);
                    if(!departamentoEncontrado){
                        errores.departamento = 'Este departamento no está registrado en el sistema';
                    }
                    req.body.departamento = Campos.departamento;
                }else{
                    req.body.departamento = null;
                }
            }catch(error){
                console.error("Problemas al realizar la consulta para el departamento");
                return res.status(400).json({ success: false, error});
            }

        }else{
            req.body.departamento = null;
        }
    }else{
        req.body.rol = null;
        req.body.subrol = null;
        req.body.departamento = null;
    }

    // Validar la foto
    if (foto) {
        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
        const TAMANO_MAXIMO = 10 * 1024 * 1024; // 10 MB
    
        if (!tiposPermitidos.includes(foto.mimetype)) {
            errores.foto = 'Error: El archivo debe ser una imagen en formato PNG, JPG o JPEG.';
        } else if (foto.size > TAMANO_MAXIMO) {
            errores.foto = 'Error: El archivo debe tener un tamaño máximo de 10 MB.';
        }
    }

    // Si hay errores, devolverlos
    if (Object.keys(errores).length > 0) {
        return res.status(400).json({ success: false, errores });
    }

    // Si no hay errores, continuar con la siguiente función de middleware
    next();
};

module.exports = { validateEditUserData };
