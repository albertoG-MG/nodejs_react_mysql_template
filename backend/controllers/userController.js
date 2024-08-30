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

module.exports = {getUsers};