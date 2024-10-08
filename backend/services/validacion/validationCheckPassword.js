const userModel = require('../../models/userModel')

const checarPassword = async (password) => {
    const blacklistedPasswords = await userModel.checarblacklisted();
    const isBlacklisted = blacklistedPasswords.find(blacklisted => blacklisted.password === password);
    return isBlacklisted ? password : null;
}

module.exports = { checarPassword };
