const userModel = require("../../models/userModel");

const checarUsuarios = async (username) => {
    return await userModel.checarUsuarios(username);
}

module.exports = { checarUsuarios };