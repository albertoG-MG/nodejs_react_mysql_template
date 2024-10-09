const userModel = require("../../models/userModel");

const crearUsuario = async (formData, foto) => {
    const { username, password, nombre, apellido_pat, apellido_mat, correo, rol, subrol, departamento, foto } = formData;
    try {
        //const nuevoUsuario = await guardarUsuarioEnBaseDeDatos({ nombre, email, contraseña });
        //return nuevoUsuario;
    } catch (error) {
        //console.error("Error al guardar el usuario:", error);
        //return false;
    }
};

module.exports = { crearUsuario };