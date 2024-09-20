const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const getUsers = (req, res) => {
    userModel.getUsers((err, users) => {
        if (err) {
            console.error("Error al obtener usuarios: " + err.stack);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        return res.json(users);
    });
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
