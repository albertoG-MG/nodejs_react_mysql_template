const db = require('../config/conexion');
const crypto = require('crypto');

const getUsers = async (query, limit, skip, sortField, sortOrder, callback) => {
    try {
        // Preparar la consulta base
        let sql = `
            SELECT u.id id, CONCAT(u.nombre, ' ', u.apellido_pat, ' ', u.apellido_mat) nombre, u.correo correo, COALESCE(d.departamento, 'SIN DEPARTAMENTO') depanom,
            COALESCE(r.nombre, 'SIN ROL') rolnom, COALESCE(sb.subrol_nombre, 'SIN PUESTO') subrolnom, u.nombre_foto nombre_foto, u.foto_identificador foto_identificador
            FROM usuarios u
            LEFT JOIN roles r ON r.id=u.roles_id
            LEFT JOIN departamentos d ON d.id=u.departamento_id
            LEFT JOIN subroles sb ON sb.id=u.subrol_id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Agregar condiciones de búsqueda solo si hay un valor para `query`
        if (query) {
            sql += ` AND (u.id = ? OR u.username LIKE ? OR u.correo LIKE ? OR d.departamento LIKE ? OR r.nombre LIKE ? OR sb.subrol_nombre LIKE ?)`;
            params.push(query, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
        }

        // Agregar orden y límites
        sql += ` ORDER BY ?? ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(sortField, limit, skip);

        const [rows] = await db.query(sql, params);
        
        callback(null, rows);
    } catch (err) {
        callback(err);
    }
};

const getTotalUsers = async (query) => {
    let sql = `
        SELECT COUNT(*) as count 
        FROM usuarios u 
        LEFT JOIN roles r ON r.id = u.roles_id 
        LEFT JOIN departamentos d ON d.id = u.departamento_id 
        LEFT JOIN subroles sb ON sb.id = u.subrol_id 
        WHERE 1=1
    `;
    const params = [];

    // Agregar condiciones de búsqueda solo si hay un valor para `query`
    if (query) {
        sql += ` AND (u.id = ? OR u.username LIKE ? OR u.correo LIKE ? OR d.departamento LIKE ? OR r.nombre LIKE ? OR sb.subrol_nombre LIKE ?)`;
        params.push(query, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].count; // Devuelve el total
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

module.exports = {getUsers, getTotalUsers, login};