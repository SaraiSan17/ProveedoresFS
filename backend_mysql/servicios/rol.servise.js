const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Rol.findAll();
}

async function getById(id) {
    return await getRol(id);
}

async function create(params) {
    
    // save rol
    await db.Rol.create(params);
}

async function update(id, params) {
    const rol = await getRol(id);

    // copy params to rol and save
    Object.assign(rol, params);
    await rol.save();
}

async function _delete(id) {
    const rol = await getRol(id);
    await rol.destroy();
}

// helper functions

async function getRol(id) {
    const rol = await db.Rol.findByPk(id);
    if (!rol) throw 'Rol no encontrado';
    return rol;
}
