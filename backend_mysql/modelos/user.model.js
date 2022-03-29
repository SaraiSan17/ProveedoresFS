const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        rfc: { type: DataTypes.STRING, allowNull: false },
        razon_social: { type: DataTypes.STRING, allowNull: false },
        sucursal: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        direccion: { type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        rol_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2,
            references:{
                model: "Rol",
                key: 'id'
            }
        },
    };

    const options = {
        tableName: 'users',
        defaultScope: {
            // exclude password by default
            attributes: { exclude: ['password'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}