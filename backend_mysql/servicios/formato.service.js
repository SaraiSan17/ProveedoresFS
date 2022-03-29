const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Formato.findAll();
}

async function getById(id) {
    return await getFormato(id);
}

async function create(params) {
    // save formato
    await db.Formato.create(params);
}

async function update(id, params) {
    const formato = await getFormato(id);

    // copy params to formato and save
    Object.assign(formato, params);
    await formato.save();

    return formato.get();
}

async function _delete(id) {
    const formato = await getFormato(id);
    await formato.destroy();
}

// helper functions

async function getFormato(id) {
    const formato = await db.Formato.findByPk(id);
    if (!formato) throw 'Formato no encontrado';
    return formato;
}