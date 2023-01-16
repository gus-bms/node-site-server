module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 저장된 장소 목록 조회
  app.post("/api/log/insertLog", async (req, res) => {
    try {
      console.log("insertLog", req.body);
      let imgList = req.body.images;
      db.getConnection(async (err, connection) => {
        const sql = `
          INSERT INTO log
          (title, spot_pk, content, user_pk, reg_dt)
          VALUES ('${req.body.title}', ${req.body.spot_pk}, '${req.body.content}', ${req.body.user_pk}, now())
        `;
        connection.query(sql, async function (err, rows) {
          if (err) throw err;
          if (Array.isArray(imgList) && imgList.length > 0) {
            await insertLogImg(imgList, rows.insertId);
          }
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

  async function insertLogImg(imgList, logPk) {
    db.getConnection(async (err, connection) => {
      console.log("hi");
      imgList.map((item) => {
        let sql = `
        INSERT INTO log_img
        (log_pk, img_name)
        VALUES
        (${logPk}, '${item}')
      `;

        connection.query(sql, function (err, rows) {
          if (err) throw err;
          console.log(rows);
        });
      });
    });
  }
};
