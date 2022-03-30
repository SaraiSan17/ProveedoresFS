const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    
    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // iniciamos modelos y relaciones
    db.User = require('../modelos/user.model')(sequelize);
    db.Rol = require('../modelos/rol.model')(sequelize);
    db.User.belongsTo(db.Rol,{foreignKey: 'rol_id'});
    db.Cliente = require('../modelos/cliente.model')(sequelize);
    db.Proyecto = require('../modelos/proyecto.model')(sequelize);
    db.Material = require('../modelos/material.model')(sequelize);
    db.Asignacion = require('../modelos/asignacion.model')(sequelize);
    db.Formato = require('../modelos/formato.model')(sequelize);
    db.Documento = require('../modelos/documento.model')(sequelize);
    db.Requisicion = require('../modelos/requisicion.model')(sequelize);
    db.ReqMat = require('../modelos/req_mat.model')(sequelize);
    // sync all models with database
    await sequelize.sync();

    initAdmin()
}

async function initAdmin(){
    admin = await db.User.findAll({where: {rol_id: 1}});
    if(admin.length == 0){
        // user
        await db.User.create({
            rfc: "XXXX010101XXX",
            razon_social: "Admin",
            sucursal: "CENTRO",
            password: await bcrypt.hash('11111111', 10),
            direccion: "Conocida",
            id_rol: 1

        });
    }else {
        console.log("have Admin")
    }
}