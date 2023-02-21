const util = require("util");

// 서버 가동시 init을 통해서 db 초기화 실행
module.exports.init = async (app) => {
  const db = await require("../db/db").connection;
};

module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 저장된 장소 목록 조회
  app.get("/api/spot/selectSpotList", async (req, res) => {
    let address = req.query.address_dong != "" ? req.query.address_dong : "%";
    let pages = req.query.pages;
    let isInit = req.query.isInit;

    try {
      db.getConnection(async (err, connection) => {
        const query = util.promisify(connection.query).bind(connection);
        const sql = `
          SELECT *
          FROM spot
          WHERE 1=1
          AND address_dong LIKE '%${address}%'
          LIMIT ${pages}
        `;

        let resp = await query(sql);

        if (isInit === "true") {
          let count =
            await query(`SELECT count(spot_pk) as count FROM spot WHERE 1=1
          AND address_dong LIKE '%${address}%'
          `);
          console.log("count == ", count[0]);
          connection.release();
          res.json({
            r: true,
            list: resp,
            count: count[0].count,
          });
          return;
        }
        console.log("not Init!!");
        connection.release();
        res.json({
          r: true,
          list: resp,
        });
      });
    } catch (err) {
      console.log(err);
      connection.release();
    }
  });

  // DB에 log를 저장합니다.
  app.post("/api/spot/insertSpot", async (req, res) => {
    try {
      console.log("insertSpot", req.body);
      db.getConnection(async (err, connection) => {
        const sql = `
          INSERT INTO spot
          (name, category, address, address_dong, reg_id, reg_dt)
          VALUES ('${req.body.name}', '${req.body.type}', '${req.body.address}', '${req.body.address_dong}', ${req.body.user_pk}, now())
        `;
        connection.query(sql, async function (err, rows) {
          connection.release();
          if (err) {
            console.log(err);
            res.json({
              r: false,
            });
            return;
          }

          console.log(rows);
          res.json({
            r: true,
            // id: rows.insertId,
          });
        });
      });
    } catch (err) {
      console.log(err);
      connection.release();
      res.json({
        r: false,
      });
    }
  });
};
