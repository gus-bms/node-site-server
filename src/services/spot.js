// 서버 가동시 init을 통해서 db 초기화 실행
module.exports.init = async (app) => {
  const db = await require("../db/db").connection;
};

module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 저장된 장소 목록 조회
  app.get("/api/selectSpotList", async (req, res) => {
    try {
      db.getConnection(async (err, connection) => {
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
      });
    } catch (err) {
      console.log(err);
    }
  });
};
