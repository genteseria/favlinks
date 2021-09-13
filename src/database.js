const mysql = require('mysql');

const { database } = require('./keys');

const pool = mysql.createPool(database);
const { promisify } = require('util');

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error("ERROR: Se perdió la conexión con la base de datos.");
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error("ERROR: La base de datos tiene demasiadas conexiones.");
        }
        if (err.code === 'ECONNREFUSED'){
            console.error("ERROR: La BD rechazó la conexión. Revise las credenciales.");
        }
    }

    if (connection){
        console.log("Se estableció conexión con la base de datos.");
        connection.release();
    }
    
    return;
});

//Promisificando querys a la DB
pool.query = promisify(pool.query);

module.exports = pool;
