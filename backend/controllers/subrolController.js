const subrolModel = require('../models/subrolModel');

const getSubrolesxRolxUsuarios = async (req, res) => {
    const { roleId } = req.query;

    try {
        const subroles = await subrolModel.getSubrolesxRolxUsuarios(roleId);

        if (!subroles || subroles.length === 0) {
            return res.status(404).json({ message: 'No se encontraron subroles' });
        }

        return res.json(subroles);
    } catch (error) {
        console.error("Error al obtener subroles: ", error);
        return res.status(500).json({ error: 'Error al obtener subroles' });
    }
};

module.exports = { getSubrolesxRolxUsuarios };
