# NoticeBoard - 20193075 윤태현

데이터베이스개론 과제용 레퍼지토리 입니다.  
과제 내용 : **DBMS를 활용한 게시판 웹 페이지 구축**

수고하셨습니다. commit message를 잘 활용해주세요.

* **게시판 기능**
  * 전체 글 조회 (n개 단위 조회 / 페이징)  
   -> 내용 / 댓글을 제외한 모든 내용을 리스트로 확인
  * 게시글 상세 조회
  * 게시글 작성  
   -> 작성자, 제목, 내용, 작성일자, 고유번호가 포함
  * 게시글 삭제  
   -> 댓글까지 삭제
  * 댓글 작성  
   -> 작성자, 시간, 내용이 포함 / 대댓글은 없음
  * 댓글 삭제

* **구현 환경**
  * RDBMS : MariaDB
  * 웹 페이지 구축 (frontend) : HTML / 웹 프레임워크
  * 웹 서버 (backend) : node.js

* **사전 준비**
  * node.js 설치
  * 터미널이나 명령 프롬프트에서 npm install express, npm install mysql --save 실행  
    -> node_modules, package.json, package-lock.json 생성
  * MariaDB에서 게시판 DB 구축.sql 파일에 들어있는 sql문 실행
  * maria.js 파일의 password 입력
  * 터미널이나 명령 프롬프트에서 node app.js 실행
  * 크롬이나 edge의 주소창에 localhost:3000입력

* **동작 설명**
  * 추후 수정
