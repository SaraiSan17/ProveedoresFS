const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        clave: { type: DataTypes.STRING, allowNull: false },
        cantidad: { type: DataTypes.INTEGER, allowNull: false },
        unidad: { type: DataTypes.STRING, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'material',
    };

    return sequelize.define('Material', attributes, options);
}