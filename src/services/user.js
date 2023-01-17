module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 저장된 USER 조회
  app.post("/api/selectUser", async (req, res) => {
    try {
      db.getConnection(async (err, connection) => {
        const sql = `
          SELECT *
          FROM user
          WHERE 1=1
          AND uid = '${req.body.id}'
        `;
        console.log(sql);
        connection.query(sql, (err, rows) => {
          console.log(rows);
          connection.release();
          Array.isArray(rows) && rows.length != 0
            ? res.json({
                r: true,
                uid: rows[0].uid,
              })
            : res.json({
                r: false,
              });
        });
      });
    } catch (err) {
      connection.release();
      console.log(err);
      res.json({
        r: false,
      });
    }
  });

  // oauth 후 조회된 사용자 정보 DB에 저장
  app.post("/api/insertUser", async (req, res) => {
    const email = req.body.email != undefined ? req.body.email : "";
    const profileUrl =
      req.body.profile_image != undefined ? req.body.profile_image : "";
    try {
      db.getConnection(async (err, connection) => {
        const sql = `
          INSERT INTO user
          (uid, name, email, profile_url, reg_date)
          VALUES
          ('${req.body.uid}', '${req.body.name}', '${email}', '${profileUrl}', now())
        `;
        connection.query(sql, (err, rows) => {
          connection.release();
          err
            ? (console.log(err),
              res.json({
                r: false,
              }))
            : res.json({
                r: true,
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
