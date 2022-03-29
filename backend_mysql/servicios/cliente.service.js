const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Cliente.findAll();
}

async function getById(id) {
    return await getCliente(id);
}

async function create(params) {
    // validate
    if (await db.Cliente.findOne({ where: { rfc: params.rfc } })) {
        throw 'RFC "' + params.rfc + '" ya existe';
    }
    // save cliente
    await db.Cliente.create(params);
}

async function update(id, params) {
    const cliente = await getCliente(id);

    // validate
    const clienterfcChanged = params.rfc && cliente.rfc !== params.rfc;
    if (clienterfcChanged && await db.Cliente.findOne({ where: { rfc: params.rfc } })) {
        throw 'RFC "' + params.rfc + '" ya existe';
    }

    // copy params to cliente and save
    Object.assign(cliente, params);
    await cliente.save();

    return cliente.get();
}

async function _delete(id) {
    const cliente = await getCliente(id);
    await cliente.destroy();
}

// helper functions

async function getCliente(id) {
    const cliente = await db.Cliente.findByPk(id);
    if (!cliente) throw 'Cliente no encontrado';
    return cliente;
}