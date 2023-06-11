var http = require('http'); 
var fs = require('fs'); 
var url = require('url'); 
var qs = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');


var app = http.createServer(function(request,response){ 
    var _url = request.url; 
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname; 
    var title = queryData.id; 
 

    if(pathname === '/'){ 
        if(queryData.id === undefined){
            var title = 'Welcome';
            var description = "환영합니다! : )";
            response.writeHead(200); 
            var template = ` 
            <!doctype html> 
            <html> 

            <head><title>${title}</title> <meta charset="utf-8"></head> 

            <body>
            <h1><a href="/">DAIM</a></h1>
            <h2>${description}</h2>
            <ul>
                <a href = "/login">login</a>
            </ul>
            <ul>
                <a href = "/join">join</a>
            </ul>
            </body> 
            </html> `; 
            response.writeHead(200);
            response.end(template); 
        } else {
            var title = queryData.id;
            response.writeHead(200);
        }
    } else if(pathname === '/join'){
        var title = '회원가입';
        var description = "환영합니다! : )";
        var html = `
        <!doctype html> 
        <html> 
        <head><title>${title}</title> <meta charset="utf-8"></head> 
        <body>
            <h2>회원 가입</h2>
            <form action = "/join_process" method = "post">
            <ul>
                <p> 이름  
                <input type = "text" name = "name" placeholder = "name">
                </p>
            </ul>
            <ul>
                <p>  부서  
                <select name="department">                    
                    <option value="1">R&D</option>              
                    <option value="2">IT개발</option>     
                    <option value="3">경영관리</option>
                </select>
                </p>
            </ul>
            <ul>
                <p> 사용하실 ID  
                <input type = "text" name = "id" placeholder = "id">
                </p>
            </ul>
            <ul>
                <p> 비밀번호  
                <input type = "text" name = "pw" placeholder = "pw">
                </p>
            </ul>
            <ul>
                <p> 비밀번호 확인 
                <input type = "text" name = "pw_check" placeholder = "pw_check">
                </p>
            </ul>
            <ul>
                <p> 회사 E-mail 주소
                <input type = "text" name = "mail" placeholder = "mail" value = "###@mail.com">
                </p>
            </ul>
            <p>
                <input type="submit" value = "가입하기">
            </p>
            </form>

        </body> 
        </html>
        `;
        response.writeHead(200);
        response.end(html);

    } else if(pathname === '/join_process'){
        // join에서 submit 하면 여기에서 데이터를 db로 넘겨주자
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(req){
            var post = qs.parse(body);
            const obj = JSON.parse(JSON.stringify(post)); 
            var keys = Object.keys(obj);
            // for (var i=0; i < keys.length; i++){
            //     console.log(obj[keys[i]]);
            // }

            
            var mysql = require('mysql');
            // 정보를 담은 파일
            const vals = require('./info/consts_daim.js');
            // 연결을 위한 정보 불러오기
            var con = mysql.createConnection({
                host: vals.DBHost, port:vals.DBPort,
                user: vals.DBUser, password: vals.DBPass,
                connectionLimit: 5, database: vals.DB
            });

            // 연결되었는지 확인
            con.connect(function(err){
                if (err) throw err;
                console.log("You are connected");
            });

            // 수행하고 싶은 작업(sql문) 
            var sql = 'INSERT INTO tb_user(user_name, user_department, user_id, user_pw, user_email) VALUES(?,?,?,?,?)';
            var params = [obj[keys[0]],obj[keys[1]],obj[keys[2]],obj[keys[4]],obj[keys[5]]]
            con.query(sql, params, function(err, rows, fields){
                if(err){
                    console.log(err);
                } else{
                    console.log(rows.name);
                }
            });

            con.end();


            // 전송 후 첫화면으로 돌아간다.
            response.writeHead(302, {Location : `/`});
            response.end();
           
        });
    } else if(pathname === '/login'){
        var title = '로그인';
        var description = "ID와 PW를 입력해주세요.";
        var html = `
        <!doctype html> 
        <html> 
        <head><title>${title}</title> <meta charset="utf-8"></head> 
        <body>
            <h2>로그인</h2>
            <form action = "/login_process" method = "post">
            <ul>
                <p> ID
                <input type = "text" name = "id" placeholder = "id">
                </p>
            </ul>
            <ul>
                <p> PW
                <input type = "text" name = "pw" placeholder = "pw">
                </p>
            </ul>
            <p>
                <input type="submit" value = "로그인">
            </p>
            </form>

        </body> 
        </html>
        `;
        response.writeHead(200);
        response.end(html);
    } else if(pathname === '/login_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });

        request.on('end', function(req){
            var post = qs.parse(body);
            const obj = JSON.parse(JSON.stringify(post));
            var keys = Object.keys(obj);
        });

    }

    if(pathname == '/favicon.ico'){ 
        return response.writeHead(404); 
    }; 
});
    app.listen(3000);