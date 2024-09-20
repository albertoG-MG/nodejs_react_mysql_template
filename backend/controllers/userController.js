const userModel = require('../models/userModel');

const getUsers = (req, res) => {
    userModel.getUsers((err, users) => {
        if(err){
            console.error("Error al obtener usuarios" +err.stack);
            return res.status(500).json({ error: 'Error al obtener usuarios'});
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
        return res.json({ message: 'Autenticación exitosa', user });
    });
};

module.exports = {getUsers, login};