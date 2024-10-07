const db = require('../config/conexion');

const getRolesxUsuarios = async () => {
    try {
        let sql = `
            SELECT * FROM roles
        `;

        const [rows] = await db.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
};

const ObtenerRolporId = async (roleId) => {
    try {
        const sql = `SELECT nombre FROM roles WHERE id = ?`;
        const [rows] = await db.query(sql, [roleId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
};


module.exports = { getRolesxUsuarios, ObtenerRolporId };
