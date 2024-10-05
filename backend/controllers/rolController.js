const rolModel = require('../models/rolModel');

const getRolesxUsuarios = async (req, res) => {
    try {
        const roles = await rolModel.getRolesxUsuarios();

        if (!roles || roles.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }

        return res.json(roles);
    } catch (error) {
        console.error("Error al obtener roles: ", error);
        return res.status(500).json({ error: 'Error al obtener roles' });
    }
};

module.exports = { getRolesxUsuarios };
