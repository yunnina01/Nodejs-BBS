var http = require('http');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');

// mariaDB 연결
var con = require('./maria');
con.connect();

// page는 현재 페이지를 위한 변수이고, pagesize는 n개 단위 페이징을 위한 변수입니다.
var page = 1, pagesize = 10;
var postid, commid = [];

var app = http.createServer(function(req, res){ 
    var _url = req.url; 
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname; 
    var title = queryData.id;
    
    // 게시판 홈페이지
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
                            list = list + "<li><a href = '/detail" + i + "'>" + rows[i].고유번호
                            + " / " + rows[i]. 제목 + " / " + rows[i].작성자 + " / " + rows[i].작성일자 + "</a></li>";
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
    // 페이지 이동 작업
    else if(pathname === '/minuspage'){
        if(page > 1)
            page--;
        res.writeHead(302, {Location : `/`});
        res.end();
    }
    // 페이지 이동 작업
    else if(pathname === '/pluspage'){
        page++;
        res.writeHead(302, {Location : `/`});
        res.end();
    }
    // 게시글 작성 작업
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
    // 작성한 내용들을 DB에 저장
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
    // 게시글 상세보기 작업
    else if(pathname.startsWith('/detail')){
        for(var i = 0; i < pagesize; i++){
            if(pathname.endsWith(String(i))){
                var start = (page - 1) * pagesize + i;
                var sql = 'SELECT 고유번호, 제목, 내용 FROM 게시글 LIMIT ' + start + ', 1';
                con.query(sql, function(err, row){
                    if(err)
                        console.log(err);
                    else{
                        postid = row[0].고유번호;
                        var posttitle = row[0].제목, content = row[0].내용, list;
                        sql = "SELECT * FROM 댓글 WHERE 게시글번호 = " + postid;
                        con.query(sql, function(err, rows){
                            if(err)
                                console.log(err);
                            else{
                                list = '<ul>';
                                for(var j = 0; rows[j]; j++){
                                    list = list + "<li>" + rows[j].내용 + " / " + rows[j].작성자 + " / " + rows[j].작성시간 + "</li>";
                                    list = list + "<form action = '/delete_comment" + rows[j].댓글번호
                                    + "' method = 'post'><input type = 'submit' value = '삭제'></form>";
                                    commid[j] = rows[j].댓글번호;
                                }
                                list = list + "</ul>";
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
                                    <a href = '/delete_post'>게시글 삭제하기</a>
                                    <h3>제목</h3>
                                    ${posttitle}                    
                                    <h3>내용</h3>
                                    ${content}
                                    <h3>댓글</h3>
                                    ${list}
                                    <a href = '/comment'>댓글 작성하기</a>
                                </body>
                                </html>
                                `;
                                res.writeHead(200);
                                res.end(html);
                            }
                        });
                    }
                });
            }
        }
    }
    // 게시글 삭제 작업
    else if(pathname === '/delete_post'){
        var sql = "DELETE FROM 게시글 WHERE 고유번호 = " + postid;
        con.query(sql, function(err){
            if(err)
                console.log(err);
        });
        res.writeHead(302, {Location : `/`});
        res.end();
    }
    // 댓글 작성 작업
    else if(pathname === '/comment'){
        var title = "댓글 작성하기";
        var html = `
        <!doctype html> 
        <html> 
        <head>
            <title>${title}</title>
            <meta charset="utf-8">
        </head> 
        <body>
            <h2>댓글 작성</h2>
            <form action = "/comment_process" method = "post">
                <p>작성자
                    <input type = "text" name = "writer" placeholder = "이름을 입력하세요. (10자 내외)"
                    maxlength = 10 style = "width : 79%"></p>
                <p>내용
                    <input type = "text" name = "comment" placeholder = "댓글을 입력하세요. (300자 내외)"
                    maxlength = 300 style = "width : 80%"></p>
                <p><input type = "submit" value = "작성하기"></p>
            </form>
        </body> 
        </html>
        `;
        res.writeHead(200);
        res.end(html);
    }
    // 작성한 댓글 DB에 저장
    else if(pathname === '/comment_process'){
        var body = '';
        req.on('data', function(data){
            body = body + data;
        });
        req.on('end', function(req){
            var post = qs.parse(body);
            const obj = JSON.parse(JSON.stringify(post)); 
            var keys = Object.keys(obj);
            
            var sql = 'INSERT INTO 댓글 VALUES(NEXTVAL(댓글번호), ?, ?, NOW(), ?)';
            var params = [postid, obj[keys[0]], obj[keys[1]]];
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
    // 댓글 삭제 작업
    else if(pathname.startsWith('/delete_comment')){
        for(var i = 0; i < commid.length; i++){
            if(pathname.endsWith(String(commid[i]))){
                console.log(commid[i]);
                var sql = "DELETE FROM 댓글 WHERE 댓글번호 = " + commid[i];
                con.query(sql, function(err){
                    if(err)
                        console.log(err);
                    else
                        commid.length = 0;
                });
            }
        }
        res.writeHead(302, {Location : `/`});
        res.end();
    }
});

app.listen(3000);