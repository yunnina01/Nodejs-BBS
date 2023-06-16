var http = require('http');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');

var con = require('./maria');
con.connect();

var page = 1, pagesize = 10;

var app = http.createServer(function(req,res){ 
    var _url = req.url; 
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname; 
    var title = queryData.id;
 
    if(pathname === '/'){ 
        if(queryData.id === undefined){
            var sql, list;
            sql = "SELECT * FROM 게시글 LIMIT " + (page - 1) * pagesize + "," + pagesize;
            con.query(sql, function(err, rows){
                if(err)
                    console.log(err);
                else{
                    list = "<ul>";
                    for(var i = 0; i < pagesize; i++){
                        if(rows[i]){
                            list = list + "<li><a href = '/detail'>" + rows[i].고유번호 + " / " + rows[i]. 제목 + " / "
                            + rows[i].작성자 + " / " + rows[i].작성일자 + "</a></li>";
                        }
                    }
                    list = list + "</ul>";
                    
                    var title = '데이터베이스 게시판';
                    res.writeHead(200); 
                    var template = ` 
                    <!doctype html> 
                    <html> 
                    <head>
                        <title>${title}</title>
                        <meta charset="utf-8">
                    </head> 
                    <body>
                        <h1>데이터베이스 게시판</h1>
                        <a href = '/post'>게시글 작성하기</a>
                        <a href = '/'>게시글 삭제하기</a>
                        
                        <ul>번호 제목 작성자 작성일자</ul>
                        ${list}
                        <ul>현재 페이지 : ${page}</ul>
                        <a href = '/minuspage'>이전 페이지</a>
                        <a href = '/pluspage'>다음 페이지</a>
                    </body> 
                    </html> `; 
                    res.writeHead(200);
                    res.end(template); 
                }                
            });
        }
        else{
            var title = queryData.id;
            res.writeHead(200);
        }
    }
    else if(pathname === '/minuspage'){
        if(page > 1)
            page--;
        res.writeHead(302, {Location : `/`});
        res.end();
    }
    else if(pathname === '/pluspage'){
        page++;
        res.writeHead(302, {Location : `/`});
        res.end();
    }
    else if(pathname === '/post'){
        var title = '게시글 작성';
        var html = `
        <!doctype html> 
        <html> 
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
        </head> 
        <body>
            <h2>게시글 작성</h2>
            <form action = "/post_process" method = "post">
                <p>작성자 
                    <input type = "text" name = "name" placeholder = "이름을 입력하세요. (10자 내외)"
                    maxlength = 10 style = "width : 79%"></p>
                <p>제목
                    <input type = "text" name = "title" placeholder = "제목을 입력하세요. (30자 내외)"
                    maxlength = 30 style = "width : 80%"></p>
                <p>내용
                    <input type = "text" name = "content" placeholder = "내용을 입력하세요. (1000자 이내)"
                    maxlength = 1000 style = "width : 80%"></p>
                <p><input type = "submit" value = "작성하기"></p>
            </form>
        </body> 
        </html>
        `;
        res.writeHead(200);
        res.end(html);
    }
    else if(pathname === '/post_process'){
        var body = '';
        req.on('data', function(data){
            body = body + data;
        });
        req.on('end', function(req){
            var post = qs.parse(body);
            const obj = JSON.parse(JSON.stringify(post)); 
            var keys = Object.keys(obj);
            
            var sql = 'INSERT INTO 게시글 VALUES(NEXTVAL(게시글번호), ?, ?, CURDATE(), ?)';
            var params = [obj[keys[1]], obj[keys[0]], obj[keys[2]]];
            con.query(sql, params, function(err, row){
                if(err)
                    console.log(err);
                else
                    console.log(row.고유번호);
            });

            res.writeHead(302, {Location : `/`});
            res.end();
        });
    }
    else if(pathname === '/detail'){
        var title = "게시글 상세보기";
        var html = `
        <!doctype html> 
        <html> 
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>게시글 상세보기</h1>
            <h3>제목</h3>

            <h3>내용</h3>
            
            <h3>댓글</h3>
            
            <h1>댓글 작성</h1>
            <form action = "/comment_process" method = "post">
                <p>작성자<input type = "text"></p>
                <p>내용<input type = "text"></p>
                <p><input type = "submit" value = "작성하기"></p>
            </form>
        </body>
        </html>
        `;
        res.writeHead(200);
        res.end(html);
    }
    
    else if(pathname === '/comment_process'){

    }
});

app.listen(3000);