const util = require("util");

module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 log를 저장합니다.
  app.post("/api/log/insertLog", async (req, res) => {
    try {
      db.getConnection(async (err, connection) => {
        const query = util.promisify(connection.query).bind(connection);
        console.log("insertLog", req.body);
        let imgList = req.body.images;
        let uid = req.body.uid;
        let userPk = await query(
          `SELECT user_pk FROM user WHERE uid = '${uid}'`
        );
        const sql = `
          INSERT INTO log
          (title, spot_pk, content, user_pk, reg_dt)
          VALUES ('${req.body.title}', ${req.body.spot_pk}, '${req.body.content}', ${userPk[0].user_pk}, now())
        `;

        let resp = await query(sql);
        if (Array.isArray(imgList) && imgList.length > 0) {
          await insertLogImg(imgList, resp.insertId, req.body.representImg);
        }
        connection.release();
        res.json({
          r: true,
          id: resp.insertId,
        });
        return;
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
          SELECT l.log_pk, l.spot_pk, title, content, l.user_pk, li.log_img_pk , li.img_name, s.name, u.name, u.profile_url
          FROM log l LEFT JOIN log_img li ON l.log_pk = li.log_pk
          LEFT JOIN spot s ON l.spot_pk = s.spot_pk 
          LEFT JOIN user u on l.user_pk = u.user_pk
          WHERE l.log_pk = ${req.query.logPk}
        `;
        connection.query(sql, async function (err, rows) {
          if (err) throw err;
          connection.release();

          if (rows.length == 0) {
            res.json({
              r: false,
            });
            return;
          }
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

  // DB에 전달받은 user가 작성한 모든 log를 불러옵니다.
  app.get("/api/log/selectListLog", async (req, res) => {
    try {
      console.log("selectListLog");
      // 본 API를 호출할 때 파라미터의 타입이 나뉘기 때문에 타입명을 구합니다.
      let type = Object.keys(req.query)[0];
      let value = req.query[type];

      console.log(type, value);
      db.getConnection(async (err, connection) => {
        const sql = `
          SELECT l.log_pk, l.spot_pk, title, content, l.user_pk, li.log_img_pk , li.img_name, s.name, u.name, u.profile_url
          FROM log l LEFT JOIN log_img li ON l.log_pk = li.log_pk
          LEFT JOIN user u on l.user_pk = u.user_pk
          LEFT JOIN spot s ON l.spot_pk = s.spot_pk
          WHERE l.${type} = ${value}
          AND li.represent_yn = "Y"
        `;
        connection.query(sql, async function (err, rows) {
          if (err) throw err;
          connection.release();

          if (rows.length >= 1) {
            rows.map((row) => {
              row.isImgLog = row.img_name != null ? true : false;
            });
          }

          res.json({
            r: true,
            row: rows,
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
  async function insertLogImg(imgList, logPk, representImg) {
    console.log("insertLog", representImg);
    db.getConnection(async (err, connection) => {
      imgList.map((item) => {
        let represent_yn = item == representImg ? "Y" : "N";

        let sql = `
        INSERT INTO log_img
        (log_pk, img_name, represent_yn)
        VALUES
        (${logPk}, '${item}', '${represent_yn}')
      `;

        connection.query(sql, function (err, rows) {
          if (err) throw err;
          console.log(rows);
        });
      });
    });
  }
};
