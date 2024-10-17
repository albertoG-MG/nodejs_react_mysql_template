const userModel = require('../../models/userModel');
const validationCheckPassword = require('./validationCheckPassword');
const { hashPassword } = require('../login/loginService');

const validationCheckEditPassword = async(id, password) => {

    const checkPasswordService = await validationCheckPassword.checarPassword(password);

    if(checkPasswordService){
        return { success: true, message: `La contraseña contiene palabras ${checkPasswordService} que se encuentran en la lista negra, favor de cambiar la contraseña`};
    }

    const datosUsuario = await userModel.obtenerUsuarioxId(id);

    if(!datosUsuario){
        return { success: true, message: 'Ese usuario no existe'};
    }

    const sha1_password = hashPassword(password);

    if(datosUsuario.password == sha1_password){
        return { success: true, message: 'La contraseña no puede ser igual que la anterior'};
    }

    const checarHistorialPassword = await userModel.checarHistorialPassword(id);

    if(checarHistorialPassword){
        checarHistorialPassword.forEach(historialPassword => {
            if(historialPassword.password == sha1_password){
                const fechaActual = new Date();
                const fechaDB = new Date(historialPassword.today_date);
                const diferenciaMilisegundos = fechaActual - fechaDB;
                const diasPasados = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
                if(diasPasados < 366){
                    return { success: true, message: 'No puede volver a utilizar esta contraseña, no han pasado 365 dias'};
                }
            }
        });
    }


    return { success: false, message: 'Contraseña válida'};
}

module.exports = validationCheckEditPassword ;