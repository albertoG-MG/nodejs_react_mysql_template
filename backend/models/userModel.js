const db = require('../config/conexion');

const getUsers = async (callback) => {
    try{
        const [rows] = await db.query("SELECT * FROM usuarios");
        callback(null, rows);
    }catch(err){
        callback(err);
    }
};

module.exports = {getUsers};