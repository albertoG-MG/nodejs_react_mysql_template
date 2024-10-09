const db = require('../config/conexion');

const getSubrolesxRolxUsuarios = async (roleId) => {
    try {
        let sql = `
            SELECT subroles.* FROM subroles INNER JOIN roles ON roles.id=subroles.roles_id WHERE roles.id= ?
        `;

        const [rows] = await db.query(sql, [roleId]);
        return rows;
    } catch (err) {
        throw err;
    }
};


module.exports = { getSubrolesxRolxUsuarios };
