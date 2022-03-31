const db = require('../_helpers/db');
const Sequelize = require('../node_modules/sequelize');
const Op = Sequelize.Op;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Factura.findAll();
}

async function getById(id) {
    return await getFactura(id);
}

async function create(params) {
    // validate
    if (await db.Factura.findOne({ where: { folio: params.folio } })) {
        throw 'Folio "' + params.folio + '" ya existe';
    }
    // save Factura
    return new Promise(function(resolve, reject) {
        db.Factura.create(params,{
            returning:true                             
        }).then(function(s){
            let response = db.Factura.findOne({ where: { id: s.dataValues.id } });                      
            resolve(response);
        }); 
    })
     
}

async function update(id, params) {
    const Factura = await getFactura(id);
    //validate
    if (await db.Factura.findOne({ where: {'id': {[Op.ne]: id}, 'folio': params.folio } })) {
        throw 'Folio "' + params.folio + '" ya existe';
    }
    // copy params to Factura and save
    Object.assign(Factura, params);
    await Factura.save();

    return Factura.get();
}

async function _delete(id) {
    const Factura = await getFactura(id);
    await Factura.destroy();
}

// helper functions

async function getFactura(id) {
    const Factura = await db.Factura.findByPk(id);
    if (!Factura) throw 'Factura no encontrada';
    return Factura;
}