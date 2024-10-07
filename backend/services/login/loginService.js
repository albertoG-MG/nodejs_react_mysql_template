// servicios/userService.js
const userModel = require('../../models/userModel');
const crypto = require('crypto');

// Función para generar un hash SHA-1
const hashPassword = (password) => {
    return crypto.createHash('sha1').update(password).digest('hex');
};

const login = async (username, password) => {
    const user = await userModel.login(username);

    if (!user) {
        return null; // Usuario no encontrado
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const hashedInputPassword = hashPassword(password);
    
    if (hashedInputPassword !== user.password) {
        return null; // Contraseña incorrecta
    }

    return user; // Credenciales válidas
};

module.exports = { login };
