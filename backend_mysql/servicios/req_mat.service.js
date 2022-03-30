const db = require('../_helpers/db');

module.exports = {
    getAll,
    create,
    delete: _delete
};

async function getAll() {
    return await db.ReqMat.findAll();
}

async function create(params) {
    
    await db.ReqMat.create(params);
}


async function _delete(id) {
    const reqMat = await getReqMat(id);
    await reqMat.destroy();
}
