const mysql = require("mysql2");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configura la conexión a la base de datos
/*
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
*/

// Conecta a la base de datos
/*
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado como id ' + connection.threadId);
});
*/
// Ruta para obtener usuarios
/*
app.get("/getUsers", (req, res) => {
    connection.query("SELECT * FROM usuarios", (err, results, fields) => {
        if (err) {
            console.error("Error en la consulta: " + err.stack);
            // Envía una respuesta de error al cliente
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }

        // Envía los resultados como respuesta
        res.json(results);
    });
});
*/

const promisepool = pool.promise();

module.exports = promisepool;