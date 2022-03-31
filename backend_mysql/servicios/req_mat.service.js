const db = require('../_helpers/db');

module.exports = {
    getAll,
    create,
    deleteRefs: _deleteRefs
};

async function getAll(idr) {
    return await db.ReqMat.findAll({where: {requisicion_id:  idr},include: db.Material});
}

async function create(params) {
    
    await db.ReqMat.create(params);
}


async function _deleteRefs(idr) {
    const reqMat = await getReqMat(idr);
    reqMat.forEach(element => {
        element.destroy();
    });
}

async function getReqMat(idr) {
    const reqMat = await db.ReqMat.findAll({where: {requisicion_id:  idr}});
    if (!reqMat) throw 'REferencia no encontrada';
    return reqMat;
}