const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        rol: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
    };

    const options = {
        tableName: 'rol',
        timestamps: false
    };

    return sequelize.define('Rol', attributes, options);
}