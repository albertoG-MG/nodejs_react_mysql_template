const db = require('../config/conexion');

const obtenerTodosDepartamentos = async () => {
    try {
        const sql = `SELECT * FROM departamentos`;
        const [rows] = await db.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = { obtenerTodosDepartamentos };