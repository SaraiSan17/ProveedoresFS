const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        requisicion_id: {type: DataTypes.INTEGER},
        material_id: {type: DataTypes.INTEGER},
    };

    const options = {
        tableName: 'req_mat',
    };

    return sequelize.define('ReqMat', attributes, options);
}