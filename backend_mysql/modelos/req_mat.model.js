const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        
        requisicion_id: {type: DataTypes.INTEGER,
            references: {
                model: "Requisicion", // 'Movies' would also work
                key: 'id'
              }
            },
        material_id: {type: DataTypes.INTEGER,
            references: {
                model: "Material", // 'Movies' would also work
                key: 'id'
              }
        },
        cantidad: {type: DataTypes.INTEGER},
        notas: {type: DataTypes.STRING},
    };

    const options = {
        tableName: 'req_mat',
    };

    return sequelize.define('ReqMat', attributes, options);
}