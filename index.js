const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const PORT = process.env.port || 8000;
const mysql = require("mysql");

let corsOptions = {
  origin: "*", // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

app.use(cors(corsOptions));
// body-parser 모듈은 body 안에 있는 json을 파싱해준다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rbqja",
  port: 3306,
  database: "site",
  charset: "utf8mb4",
  connectionLimit: 1000,
});

connection.connect();

app.get("/", (req, res) => {
  console.log("requested.");
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});

app.get("/api/selectBoardList", async function (req, res) {
  const sql = `
        SELECT board_pk, title, user_pk, DATE_FORMAT(reg_dt, "%Y-%m-%d") as reg_dt
        FROM board
        WHERE 1=1
    `;
  connection.query(sql, function (err, rows) {
    if (err) throw err;
    console.log(rows);
    res.json({
      r: true,
      list: rows,
    });
  });
});

app.get("/api/selectSpotList", async function (req, res) {
  try {
    const sql = `
    SELECT *
    FROM SPOT 
    WHERE 1=1
    AND address_dong LIKE '%${req.query.address_dong}%'
  `;
    connection.query(sql, function (err, rows) {
      if (err) throw err;
      console.log(rows);
      res.json({
        r: true,
        list: rows,
      });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/selectUser", async (req, res) => {
  console.log(req.body);
  try {
    const sql = `
    SELECT *
    FROM user 
    WHERE 1=1
    AND uid = ${req.body.id}
  `;
    connection.query(sql, (err, rows) => {
      console.log(rows);
      Array.isArray(rows) && rows.length != 0
        ? res.json({
            r: true,
          })
        : res.json({
            r: false,
          });
    });
  } catch (err) {
    console.log(err);
    res.json({
      r: false,
    });
  }
});

app.post("/api/insertUser", async (req, res) => {
  console.log("insertUser");

  try {
    const sql = `
      INSERT INTO user
      (uid, name, email, profile_url)
      VALUES
      (${req.body.uid}, '${req.body.name}', '${req.body.email}', '${req.body.profile_url}')
    `;
    connection.query(sql, (err, rows) => {
      err
        ? (console.log(err),
          res.json({
            r: false,
          }))
        : res.json({
            r: true,
          });
    });
  } catch (err) {
    console.log(err);
    res.json({
      r: false,
    });
  }
});
