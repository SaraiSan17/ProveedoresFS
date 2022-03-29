const { DataTypes, Deferrable } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        ot: { type: DataTypes.STRING, allowNull: false },
        proyecto_id: { type: DataTypes.INTEGER,
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
        users_id: { type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: "User",
                key: "id"
            }
        },
        estatus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    };

    const options = {
        tableName: 'asignacion',
    };

    return sequelize.define('Asignacion', attributes, options);
}