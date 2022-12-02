const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.port || 8000;
const mysql = require("mysql");

let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

app.use(cors(corsOptions));

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'rbqja',
    port: 3306,
    database: 'site',
    charset: 'utf8mb4',
    connectionLimit: 1000
});

connection.connect();

app.get("/", (req, res) => {
    console.log("requested.")
});
  
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
});

app.get('/api/selectBoardList', async function(req, res) {
    const sql = `
        SELECT board_pk, title, user_pk, DATE_FORMAT(reg_dt, "%Y-%m-%d") as reg_dt
        FROM board
        WHERE 1=1
    `;
    connection.query(sql, function(err, rows){
        if(err) throw err;
        console.log(rows);
        res.json({
            r: true, list: rows
        });
    });
})

app.get('/api/insertBoard', async function(req,res){
    const sql = `
            INSERT INTO board
            (title)
            VALUES ('hi')
    `;
    connection.query(sql , function(err, rows){
         if(err) throw err;
    })
    res.json({
        r:true
    });
})

