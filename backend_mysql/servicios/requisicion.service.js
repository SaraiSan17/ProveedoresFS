const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Requisicion.findAll();
}

async function getById(id) {
    return await getRequisicion(id);
}

async function create(params) {
    // validate
    if (await db.Requisicion.findOne({ where: { numero: params.numero } })) {
        throw 'Numero "' + params.numero + '" ya existe';
    }
    // save Requisicion
    await db.Requisicion.create(params);
}

async function update(id, params) {
    const Requisicion = await getRequisicion(id);
    // validate
    if (await db.Requisicion.findOne({ where: { numero: params.numero } })) {
        throw 'Numero "' + params.numero + '" ya existe';
    }
    // copy params to Requisicion and save
    Object.assign(Requisicion, params);
    await Requisicion.save();

    return Requisicion.get();
}

async function _delete(id) {
    const Requisicion = await getRequisicion(id);
    await Requisicion.destroy();
}

// helper functions

async function getRequisicion(id) {
    const Requisicion = await db.Requisicion.findByPk(id);
    if (!Requisicion) throw 'Requisicion no encontrada';
    return Requisicion;
}