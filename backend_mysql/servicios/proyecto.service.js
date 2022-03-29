const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Proyecto.findAll();
}

async function getById(id) {
    return await getProyecto(id);
}

async function create(params) {
    // save proyecto
    await db.Proyecto.create(params);
}

async function update(id, params) {
    const proyecto = await getProyecto(id);

    // copy params to proyecto and save
    Object.assign(proyecto, params);
    await proyecto.save();

    return proyecto.get();
}

async function _delete(id) {
    const proyecto = await getProyecto(id);
    await proyecto.destroy();
}

// helper functions

async function getProyecto(id) {
    const proyecto = await db.Proyecto.findByPk(id);
    if (!proyecto) throw 'Proyecto no encontrado';
    return proyecto;
}