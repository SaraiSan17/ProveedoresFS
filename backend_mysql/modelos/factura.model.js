const { DataTypes, Deferrable } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        proveedor_id: { type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: "Cliente",
                key: "id"
            }
        },
        proyecto_id: { type: DataTypes.INTEGER,
            references: {
                model: "Proyecto",
                key: "id",
                deferrable: Deferrable.NOT
            }
        },
        moneda_id: { type: DataTypes.INTEGER, allowNull: false },
        folio: { type: DataTypes.STRING, allowNull: false },
        fecha_factura: { type: DataTypes.DATE, allowNull: false },
        subtotal: { type: DataTypes.DECIMAL, allowNull: false },
        iva: { type: DataTypes.DECIMAL, allowNull: false },
        total: { type: DataTypes.DECIMAL, allowNull: false },
        tipo_factura: { type: DataTypes.INTEGER, allowNull: false },
        orden_compra: { type: DataTypes.INTEGER, allowNull: false },
        requisicion_id: { type: DataTypes.INTEGER, allowNull: false },
        comentarios: { type: DataTypes.STRING, allowNull: false },
        xml: { type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'facturacion',
    };

    return sequelize.define('Factura', attributes, options);
}