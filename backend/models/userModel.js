const db = require('../config/conexion');
const crypto = require('crypto');

const getUsers = async (callback) => {
    try{
        const [rows] = await db.query("SELECT * FROM usuarios");
        callback(null, rows);
    }catch(err){
        callback(err);
    }
};

// Función para generar un hash SHA-1
const hashPassword = (password) => {
    return crypto.createHash('sha1').update(password).digest('hex');
};

const login = async (username, password, callback) => {
    try {
        // Obtener el usuario por su nombre de usuario
        const [rows] = await db.query("SELECT * FROM usuarios WHERE username = ?", [username]);

        if (rows.length === 0) {
            // Si no se encuentra el usuario, retorna null
            return callback(null, null);
        }

        const user = rows[0];

        // Comparar la contraseña proporcionada con el hash almacenado
        const hashedInputPassword = hashPassword(password);
        
        if (hashedInputPassword !== user.password) {
            // Si la contraseña no es válida, retorna null
            return callback(null, null);
        }

        // Si las credenciales son válidas, devuelve el usuario
        callback(null, user);
    } catch (err) {
        callback(err);
    }
};

module.exports = {getUsers, login};