const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ rfc, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { rfc } ,include: db.Rol});

    if (!user || !(await bcrypt.compare(password, user.password)))
        throw 'El proveedor con rfc es incorrecto o ingreso mal la contraseña';

    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll({where: {rol_id: 2},include: db.Rol});
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { rfc: params.rfc } })) {
        throw 'RFC "' + params.rfc + '" ya existe';
    }

    // hash password
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.rfc && user.rfc !== params.rfc;
    if (usernameChanged && await db.User.findOne({ where: { rfc: params.rfc } })) {
        throw 'RFC "' + params.rfc + '" ya existe';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User no encontrado';
    return user;
}

function omitHash(user) {
    const { password, ...userWithoutHash } = user;
    return userWithoutHash;
}