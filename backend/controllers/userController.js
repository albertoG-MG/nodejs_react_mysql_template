const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    const { query, limit = 10, skip = 0, sortField = "id", sortOrder = "ASC" } = req.query;

    // Convertir limit y skip a números
    const numericLimit = Number(limit);
    const numericSkip = Number(skip);

    try {
        // Obtén los usuarios
        userModel.getUsers(query, numericLimit, numericSkip, sortField, sortOrder, async (err, users) => {
            if (err) {
                console.error("Error al obtener usuarios: " + err.stack);
                return res.status(500).json({ error: 'Error al obtener usuarios' });
            }

            // Obtén el total de usuarios
            const totalUsers = await userModel.getTotalUsers(query);

            // Envía la respuesta en el formato correcto
            return res.json({ items: users, total: totalUsers });
        });
    } catch (error) {
        console.error("Error en la consulta: " + error);
        return res.status(500).json({ error: 'Error en la consulta' });
    }
};

const login = (req, res) => {
    const { username, password } = req.body;

    userModel.login(username, password, (err, user) => {
        if (err) {
            console.error("Error al autenticar usuario: " + err.stack);
            return res.status(500).json({ error: 'Error al autenticar usuario' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Puedes ajustar el tiempo de expiración
        });

        return res.json({ message: 'Autenticación exitosa', token });
    });
};

module.exports = { getUsers, login };
