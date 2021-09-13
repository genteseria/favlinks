const { Password } = require('dhole-crypto');

const helpers = {};

const keyring = require('./keyring')

helpers.hashearPassword = async (password) => {
    pwHandler = new Password(await keyring);
    let pwHash = await pwHandler.hash(password);
    return pwHash;
};

helpers.verificarPassword = async (password, hashGuardado) => {
    pwHandler = new Password(await keyring);
    if (await pwHandler.verify(password, hashGuardado))
        return true;
    else
        return false;
};

module.exports = helpers;