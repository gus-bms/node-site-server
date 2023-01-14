module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 저장된 장소 목록 조회
  app.post("/api/log/insertLog", async (req, res) => {
    try {
      console.log("insertLog", req.body);
      db.getConnection(async (err, connection) => {
        const sql = `
          INSERT INTO log
          (title, spot_pk, content, user_pk, reg_dt)
          VALUES ('${req.body.title}', ${req.body.spot_pk}, '${req.body.content}', ${req.body.user_pk}, now())
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
