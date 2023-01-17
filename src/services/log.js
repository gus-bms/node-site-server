module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 log를 저장합니다.
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
          console.log(sql);
          if (Array.isArray(imgList) && imgList.length > 0) {
            console.log("@@@@@@@@@@@@@@@@@", rows);
            await insertLogImg(imgList, rows.insertId);
          }
          connection.release();
          res.json({
            r: true,
            id: rows.insertId,
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

  // DB에 전달받은 id에 해당하는 log를 불러옵니다.
  app.get("/api/log/selectLog", async (req, res) => {
    try {
      console.log("selectLog");
      db.getConnection(async (err, connection) => {
        const sql = `
          SELECT l.log_pk, l.spot_pk, title, content, user_pk, li.log_img_pk , li.img_name, s.name 
          FROM log l LEFT JOIN log_img li ON l.log_pk = li.log_pk
          LEFT JOIN spot s ON l.spot_pk = s.spot_pk 
          WHERE l.log_pk = ${req.query.logPk}
        `;
        connection.query(sql, async function (err, rows) {
          if (err) throw err;
          connection.release();

          let isImgLog = true;
          if (rows.length == 1 && rows[0].log_img_pk == null) isImgLog = false;
          res.json({
            r: true,
            row: rows,
            isImgLog: isImgLog,
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

  // DB에 로그별 이미지(이름)를 저장합니다.
  async function insertLogImg(imgList, logPk) {
    db.getConnection(async (err, connection) => {
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
