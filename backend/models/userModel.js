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
            sql += ` AND (u.id = ? OR u.username LIKE ? OR u.correo LIKE ? OR COALESCE(d.departamento, 'SIN DEPARTAMENTO') LIKE ? OR COALESCE(r.nombre, 'SIN ROL') LIKE ? OR COALESCE(sb.subrol_nombre, 'SIN PUESTO') LIKE ?)`;
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
        sql += ` AND (u.id = ? OR u.username LIKE ? OR u.correo LIKE ? OR COALESCE(d.departamento, 'SIN DEPARTAMENTO') LIKE ? OR COALESCE(r.nombre, 'SIN ROL') LIKE ? OR COALESCE(sb.subrol_nombre, 'SIN PUESTO') LIKE ?)`;
        params.push(query, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }

    const [rows] = await db.query(sql, params);
    return rows[0].count; // Devuelve el total
};

const login = async (username) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE username = ?", [username]);
    return rows.length > 0 ? rows[0] : null; // Devuelve el usuario o null
};

const checarUsuarios = async (username) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE username = ?", [username]);
    return rows.length > 0;
}

const checarblacklisted = async () => {
    const [rows] = await db.query("SELECT password FROM blacklist_password");
    return rows;
}

const checarCorreo = async (correo) => {
    const [rows] = await db.query("SELECT correo  FROM usuarios WHERE correo = ? UNION ALL SELECT correo_adicional FROM expedientes WHERE correo_adicional = ?", [correo, correo]);
    return rows.length > 0 ? true : false;
}

const crearUsuario = async(nuevousuario) => {
    const { username, password, nombre, apellido_pat, apellido_mat, correo, departamento, rol, subrol, nombre_archivo, foto } = nuevousuario;

    const [result] = await db.query(
        `INSERT INTO usuarios (username, password, nombre, apellido_pat, apellido_mat, correo, departamento_id, roles_id, subrol_id, nombre_foto, foto_identificador) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, password, nombre, apellido_pat, apellido_mat, correo, departamento, rol, subrol, nombre_archivo, foto]
    );

    return result.affectedRows > 0;
}

const editarUsuario = async(id) => {
    const [rows] = await db.query("SELECT username, nombre, apellido_pat, apellido_mat, correo, roles_id, subrol_id , departamento_id, nombre_foto, foto_identificador FROM usuarios WHERE id = ?", [id]); 
    return rows.length > 0 ? rows[0] : null;
}

const checarEditUsuario = async(username, id) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE username = ? AND id != ?", [username, id])
    return rows.length > 0 ? true : false
}

const obtenerUsuarioxId = async(id) => {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
}

const checarHistorialPassword = async(id) => {
    const [rows] = await db.query("SELECT * FROM usuarios LEFT JOIN historial_password ON historial_password.user_id = usuarios.id WHERE usuarios.id = ?", [id]);
    return rows.length > 0 ? rows : null;
}

const checarEditCorreo = async(id, correo) => {
    const [rows] = await db.query("SELECT correo FROM usuarios WHERE correo = ? AND id != ? UNION ALL SELECT correo_adicional FROM expedientes WHERE correo_adicional = ?", [correo, id, correo])
    return rows.length > 0 ? true : false;
}

const editarUsuarioPage = async (editarUsuario, id) => {
    const { username, password, nombre, apellido_pat, apellido_mat, correo, departamento, rol, subrol, nombre_archivo, foto } = editarUsuario;

    // Crear la consulta SQL para actualizar el usuario
    const query = `
        UPDATE usuarios 
        SET 
            username = ?, 
            password = ?, 
            nombre = ?, 
            apellido_pat = ?, 
            apellido_mat = ?, 
            correo = ?, 
            departamento_id = ?, 
            roles_id = ?, 
            subrol_id = ?, 
            nombre_foto = ?, 
            foto_identificador = ?
        WHERE id = ?
    `;

    // Ejecutar la consulta con los nuevos valores y el ID del usuario
    const [result] = await db.query(query, [
        username, 
        password, 
        nombre, 
        apellido_pat, 
        apellido_mat, 
        correo, 
        departamento, 
        rol, 
        subrol, 
        nombre_archivo, 
        foto,
        id // ID del usuario que se va a actualizar
    ]);

    // Retornar si la actualización fue exitosa
    return result.affectedRows > 0;
}

const eliminarUsuario = async(id) => {
    const [rows] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return rows.affectedRows > 0;
}

module.exports = {getUsers, getTotalUsers, login, checarUsuarios, checarblacklisted, checarCorreo, crearUsuario, editarUsuario, checarEditUsuario, obtenerUsuarioxId, checarHistorialPassword, checarEditCorreo, editarUsuarioPage, eliminarUsuario};