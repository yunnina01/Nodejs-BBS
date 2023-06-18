#데이터베이스 생성
CREATE DATABASE NB;

#생성한 데이터베이스 사용
USE NB;

#게시글 테이블 생성
CREATE TABLE 게시글(
	고유번호 INT,
	제목 VARCHAR(30),
	작성자 VARCHAR(10),
	작성일자 DATE,
	내용 VARCHAR(1000),
	PRIMARY KEY(고유번호)
);

#댓글 테이블 생성
#ON DELETE CASCADE문으로 연쇄 삭제
CREATE TABLE 댓글(
	댓글번호 INT,
	게시글번호 INT,
	작성자 VARCHAR(10),
	작성시간 DATETIME,
	내용 VARCHAR(300),
	PRIMARY KEY(댓글번호, 게시글번호),
	FOREIGN KEY(게시글번호) REFERENCES 게시글(고유번호)
	ON DELETE CASCADE
);

#게시글 번호 부여용 시퀀스 생성
CREATE SEQUENCE 게시글번호
START WITH 1
INCREMENT BY 1
MAXVALUE 99999;

#댓글 번호 부여용 시퀀스 생성
CREATE SEQUENCE 댓글번호
START WITH 1
INCREMENT BY 1
MAXVALUE 999999;

#게시글 번호와 댓글 번호 시퀀스 1번부터 재시작
ALTER SEQUENCE 게시글번호 restart;
ALTER SEQUENCE 댓글번호 restart;