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
    return await db.Material.findAll();
}

async function getById(id) {
    return await getMaterial(id);
}

async function create(params) {
    // validate
    if (await db.Material.findOne({ where: { clave: params.clave} })) {
        throw 'Clave "' + params.clave + '" ya existe';
    }
    if (await db.Material.findOne({ where: { descripcion: params.descripcion} })) {
        throw 'Descripcion "' + params.descripcion + '" ya existe';
    }
    // save material
    await db.Material.create(params);
}

async function update(id, params) {
    const material = await getMaterial(id);

    /// validate
    if (await db.Material.findOne({ where: { id: {[Op.ne]: id}, clave: params.clave} })) {
        throw 'Clave "' + params.clave + '" ya existe';
    }
    if (await db.Material.findOne({ where: {id: {[Op.ne]: id}, descripcion: params.descripcion} })) {
        throw 'Descripcion "' + params.descripcion + '" ya existe';
    }

    // copy params to material and save
    Object.assign(material, params);
    await material.save();

    return material.get();
}

async function _delete(id) {
    const material = await getMaterial(id);
    await material.destroy();
}

// helper functions

async function getMaterial(id) {
    const material = await db.Material.findByPk(id);
    if (!material) throw 'Material no encontrado';
    return material;
}