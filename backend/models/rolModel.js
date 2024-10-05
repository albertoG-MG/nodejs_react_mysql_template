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


module.exports = { getRolesxUsuarios };
