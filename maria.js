var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'nb'
});

module.exports = con;