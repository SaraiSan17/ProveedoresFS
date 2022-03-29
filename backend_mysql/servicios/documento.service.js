const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Documento.findAll();
}

async function getById(id) {
    return await getDocumento(id);
}

async function create(params) {
    // save documento
    await db.Documento.create(params);
}

async function update(id, params) {
    const documento = await getDocumento(id);

    // copy params to documento and save
    Object.assign(documento, params);
    await documento.save();

    return documento.get();
}

async function _delete(id) {
    const documento = await getDocumento(id);
    await documento.destroy();
}

// helper functions

async function getDocumento(id) {
    const documento = await db.Documento.findByPk(id);
    if (!documento) throw 'Documento no encontrado';
    return documento;
}