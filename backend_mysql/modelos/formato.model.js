const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        nombre: { type: DataTypes.STRING, allowNull: false },
        estatus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'formato',
    };

    return sequelize.define('Formato', attributes, options);
}