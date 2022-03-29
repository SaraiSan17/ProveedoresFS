const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        clave: { type: DataTypes.STRING, allowNull: false },
        cliente: { type: DataTypes.STRING, allowNull: false },
        monto: { type: DataTypes.DECIMAL, allowNull: false },
        ot: { type: DataTypes.STRING, allowNull: false },
        tipo: { type: DataTypes.INTEGER, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'proyecto',
    };

    return sequelize.define('Proyecto', attributes, options);
}