const db = require('../_helpers/db');
const Sequelize = require('../node_modules/sequelize')
const Op = Sequelize.Op;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Asignacion.findAll();
}

async function getById(id) {
    return await getAsignacion(id);
}

async function create(params) {
    // validate
    if (await db.Asignacion.findOne({ where: { ot: params.ot} })) {
        throw '#OT "' + params.ot + '" ya existe';
    }

    // save asignacion
    await db.Asignacion.create(params);
}

async function update(id, params) {
    const asignacion = await getAsignacion(id);

    /// validate
    if (await db.Asignacion.findOne({ where: { id: {[Op.ne]: id}, ot: params.ot} })) {
        throw '#OT "' + params.ot + '" ya existe';
    }

    // copy params to asignacion and save
    Object.assign(asignacion, params);
    await asignacion.save();

    return asignacion.get();
}

async function _delete(id) {
    const asignacion = await getAsignacion(id);
    await asignacion.destroy();
}

// helper functions

async function getAsignacion(id) {
    const asignacion = await db.Asignacion.findByPk(id);
    if (!asignacion) throw 'Asignacion no encontrado';
    return asignacion;
}