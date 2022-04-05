const db = require('../_helpers/db');
const Sequelize = require('../node_modules/sequelize');
const Op = Sequelize.Op;

module.exports = {
    getAll,
    getById,
    create,
    update,
    atach,
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
    return new Promise(function(resolve, reject) {
        db.Requisicion.create(params,{
            returning:true                             
        }).then(function(s){
            let response = db.Requisicion.findOne({ where: { id: s.dataValues.id } });                      
            resolve(response);
        }); 
    })
     
}

async function update(id, params) {
    const Requisicion = await getRequisicion(id);
    const mats = params.materiales
    delete params.materiales
    console.log("MATS",mats)
    console.log("PARAMS", params)
    // validate
    if (await db.Requisicion.findOne({ where: {'id': {[Op.ne]: id}, 'numero': params.numero } })) {
        throw 'Numero "' + params.numero + '" ya existe';
    }
    console.log("After await")
    // copy params to Requisicion and save
    Object.assign(Requisicion, params);
    await Requisicion.save();

    return Requisicion.get();
}

async function atach(id,idP){
    const Requisicion = await getRequisicion(id);
    console.log("IDPROVEEDORE",idP)
    Object.assign(Requisicion, {proveedor_id: idP});
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