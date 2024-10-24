const userModel = require('../models/userModel');
const userService = require('../services/login/loginService');
const createUserService = require('../services/crear_usuarios/createUserService');
const validationCheckUserService = require('../services/validacion/validationCheckUserService');
const validationCheckPassword = require('../services/validacion/validationCheckPassword');
const validationCheckCorreo = require('../services/validacion/validationCheckCorreo');
const validationCheckEditPassword = require('../services/validacion/validationCheckEditPassword');
const editarUserService = require('../services/editar_usuarios/editarUserService');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    const { query, limit = 10, skip = 0, sortField = "id", sortOrder = "ASC" } = req.query;

    // Convertir limit y skip a números
    const numericLimit = Number(limit);
    const numericSkip = Number(skip);

    try {
        // Obtén los usuarios
        userModel.getUsers(query, numericLimit, numericSkip, sortField, sortOrder, async (err, users) => {
            if (err) {
                console.error("Error al obtener usuarios: " + err.stack);
                return res.status(500).json({ error: 'Error al obtener usuarios' });
            }

            // Obtén el total de usuarios
            const totalUsers = await userModel.getTotalUsers(query);

            // Envía la respuesta en el formato correcto
            return res.json({ items: users, total: totalUsers });
        });
    } catch (error) {
        console.error("Error en la consulta: " + error);
        return res.status(500).json({ error: 'Error en la consulta' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userService.login(username, password);

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Puedes ajustar el tiempo de expiración
        });

        return res.json({ message: 'Autenticación exitosa', token });
    } catch (err) {
        console.error("Error al autenticar usuario: " + err.stack);
        return res.status(500).json({ error: 'Error al autenticar usuario' });
    }
};

//Checa si el usuario está repetido
const checarUsuarios = async (req, res) => {
    const { username } = req.query;

    try {
        if (!username) {
            return res.status(400).json({ error: "El nombre de usuario es requerido." });
        }

        const exists = await validationCheckUserService.checarUsuarios(username);

        if (!exists) {
            return res.json({ success: true, message: "Usuario disponible" });
        }

        return res.json({ success: false, message: "Usuario no disponible" });
    } catch (error) {
        console.error("Error en la consulta: " + error);
        return res.status(500).json({ error: "Error en la consulta" });
    }
};

const checarPassword = async (req, res) => {
    const { password } = req.query;

    try {
        const blacklistedPassword = await validationCheckPassword.checarPassword(password);

        if (blacklistedPassword) {
            return res.json({ 
                success: false, 
                message: `La contraseña está en la lista negra, contiene "${blacklistedPassword}", prueba con otra contraseña.` 
            });
        }

        return res.json({ 
            success: true, 
            message: "La contraseña no está en la lista negra." 
        });
    } catch (error) {
        console.error("Error en la consulta: " + error);
        return res.status(500).json({ error: "Error en la consulta" });
    }
}

const checarCorreo = async (req, res) => {
    const { correo } = req.query;

    try{
        const correo_user = await validationCheckCorreo.checarCorreo(correo);

        if(!correo_user){
            return res.json({ success: true, message: "Correo disponible." });
        }

        return res.json({ success: false, message: "Este correo está repetido; por favor, escoga otro."  });
    }catch(error){
        console.error("Error en la consulta: " +error);
        return res.status(500).json({ error: "Error en la consulta" });
    }
}

const crearUsuario = async (req, res) => {
    const formData  = req.body;
    const foto = req.file; 

    try{
        const usuario_creado = await createUserService.crearUsuario(formData, foto);

        if(usuario_creado){
            console.log("Usuario creado exitósamente");
            return res.json({ success: true, message: "Usuario creado exitósamente"  });
        }else{
            console.error("Error al crear usuario");
            return res.json({ success: false, message: "Error al crear usuario"  });
        }
    }catch(error){
        console.error("Error en la API de crear usuario" +error);
        return res.status(500).json({ error: "Error en la API de crear usuario"  });
    }
}

const editarUsuario = async (req, res) => {

    const id = Number(req.query.id);

    try{
        const getusuarioxid = await userModel.editarUsuario(id);

        if(!getusuarioxid){
            console.error("Error al obtener el usuario");
            return res.json({ success: false, message: "Error al obtener el usuario"  });
        }

        return res.json({ success: true, message: 'Usuario obtenido con éxito', getusuarioxid});
    }catch(error){
        console.error("Error en la consulta para obtener el usuario" +error);
        return res.status(500).json({ error: "Error en la consulta para obtener el usuario" });
    }
}

const checarEditUsuario = async(req, res) => {
    const { username, id } = req.query;

    try{
        const getUsername = await userModel.checarEditUsuario(username, id);

        if(!getUsername){
            return res.json({ success: true, message: "El usuario está disponible"});
        }

        console.error("Usuario no disponible");
        return res.json({ success: false, message: "El usuario no está disponible"  });
    }catch(error){
        console.error("Error en la API al obtener el usuario" +error);
        return res.status(500).json({ error: "Error en la API al obtener el usuario" });
    }
}

const checarEditPassword = async(req, res) => {
    const { id, password } = req.query;

    try{
        const checkPassword = await validationCheckEditPassword(id, password);

        if(checkPassword.success){
            console.error("Hubo un error en la solicitud de la contraseña" +checkPassword.message);
            return res.json({ success: checkPassword.success, message: checkPassword.message});
        }

        return res.json({ success: checkPassword.success, message: checkPassword.message});
    }catch(error){
        console.error("Error en la conexión de la API" +error);
        return res.status(500).json({ error: "Error en la conexión de la API" });
    }
}

const checarEditCorreo = async(req, res) => {
    const { id, correo  } = req.query;

    const getcorreo = await userModel.checarEditCorreo(id, correo);

    if(getcorreo){
        console.error("El correo ya existe");
        return res.json({ success: false, message: "El correo ya existe" });
    }

    return res.json({ success: true, message: "El correo está disponible" });
}

const editarUsuarioPage = async(req, res) => {
    const { id } = req.params;
    const formData  = req.body;
    const foto = req.file; 

    try{
        const usuario_editar = await editarUserService.editarUsuario(formData, foto, id);

        if(usuario_editar){
            console.log("Usuario editado exitósamente");
            return res.json({ success: true, message: "Usuario editado exitósamente"  });
        }else{
            console.error("Error al editar usuario");
            return res.json({ success: false, message: "Error al editar usuario"  });
        }
    }catch(error){
        console.error("Error en la API de editar usuario" +error);
        return res.status(500).json({ error: "Error en la API de editar usuario"  });
    }
}

const eliminarUsuario = async(req, res) => {
    const { id } = req.params;

    try{
        const usuario_eliminado = await userModel.eliminarUsuario(id);

        if(usuario_eliminado){
            return {
                success: true,
                message: "Se ha eliminado el usuario"
            };
        }else{
            console.error("No se pudo eliminar el usuario");
            return res.status(404).json({ success: false, message: "Error en la consulta para eliminar al usuario" })
        }
    }catch(error){
        console.error("Error en la conexión de la base de datos para eliminar el usuario", error);
        return res.status(500).json({ error: "Error en la conexión de la base de datos para eliminar el usuario" });
    }
}

module.exports = { getUsers, login, checarUsuarios, checarPassword, checarCorreo, crearUsuario, editarUsuario, checarEditUsuario, checarEditPassword, checarEditCorreo, editarUsuarioPage, eliminarUsuario };
