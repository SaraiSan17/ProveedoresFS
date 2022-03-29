const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        rfc: { type: DataTypes.STRING, allowNull: false },
        razon_social: { type: DataTypes.STRING, allowNull: false },
        direccion: { type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'cliente',
    };

    return sequelize.define('Cliente', attributes, options);
}