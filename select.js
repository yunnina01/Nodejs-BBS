var mysql = require('mysql');
var vals = require('./dbinform.js');

var con = mysql.createConnection({
    host: vals.DBHost,
    user: vals.DBUser,
    password: vals.DBPass,
    database: vals.DB
});

var page = 1;
var pagesize = 10;

con.connect();

con.query('SELECT * FROM 게시글 ORDER BY 고유번호 DESC LIMIT ' + (page - 1) * pagesize + ',' + pagesize, function(error, res){
    if(error)
        console.log(error);
    console.log(res);
});

con.end();