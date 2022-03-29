const { DataTypes, Deferrable } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        archivo: { type: DataTypes.STRING, allowNull: false },
        proyecto_id: { type: DataTypes.INTEGER,
            references: {
                model: "Proyecto",
                key: "id",
                deferrable: Deferrable.NOT
            }
        },
        formato_id: { type: DataTypes.INTEGER,
            references: {
                model: "Proyecto",
                key: "id",
                deferrable: Deferrable.NOT
            }
        },
        cliente_id: { type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: "Cliente",
                key: "id"
            }
        },
        comentarios: { type: DataTypes.STRING, allowNull: false, defaultValue: 1 },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'documentacion',
    };

    return sequelize.define('Documento', attributes, options);
}