var maria = require('mysql');

var con = maria.createConnection = {
    host: 'localhost',
    user: 'root',
    password: 'mariadhavkd',
    database: "nb"
};

module.exports = con;