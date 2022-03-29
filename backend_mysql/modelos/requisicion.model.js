const { DataTypes, Deferrable } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        numero: { type: DataTypes.STRING, allowNull: false },
        solicitado_por: { type: DataTypes.STRING, allowNull: false },
        liquidacion: { type: DataTypes.INTEGER, allowNull: false },
        proyecto_id: { type: DataTypes.INTEGER,
            references: {
                model: "Proyecto",
                key: "id",
                deferrable: Deferrable.NOT
            }
        },
        fecha_solicitud: { type: DataTypes.DATE, allowNull: false },
        fecha_requerida: { type: DataTypes.DATE, allowNull: false },
        autorizado_por: { type: DataTypes.STRING, allowNull: false },
        lugar_entrega: { type: DataTypes.STRING, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'requisicion',
    };

    return sequelize.define('Requisicion', attributes, options);
}