const userModel = require('../../models/userModel');

const checarCorreo = async (correo) => {
    const validar_correo = await userModel.checarCorreo(correo);
    return validar_correo;
}

module.exports = { checarCorreo };