module.exports = async function (app) {
  const db = await require("../db/db").connection;

  // DB에 저장된 USER 조회
  app.get("/api/selectUser", async (req, res) => {
    try {
      let param = Object.keys(req.query);
      let value = req.query[param];
      console.log(value);
      db.getConnection(async (err, connection) => {
        const sql = `
          SELECT *
          FROM user
          WHERE 1=1
          AND ${param} = '${value}'
        `;
        console.log(sql);
        connection.query(sql, (err, rows) => {
          console.log(rows);
          connection.release();
          Array.isArray(rows) && rows.length != 0
            ? res.json({
                r: true,
                uid: rows[0].uid,
                profileUrl: rows[0].profile_url,
                userPk: rows[0].user_pk,
                intro: rows[0].intro,
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

  // refresh token 정보 저장
  app.post("/api/user/updateRefreshToken", async (req, res) => {
    console.log("refresh token update");
    const refreshToken = req.body.refreshToken;
    const uid = req.body.uid;
    try {
      db.getConnection(async (err, connection) => {
        const sql = `
            UPDATE user
            set refresh_token = '${refreshToken}'
            WHERE
            uid = '${uid}'
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

  // 유저 정보 수정
  app.post("/api/user/update", async (req, res) => {
    console.log("user update");

    const intro = req.body.intro;
    const uid = req.body.uid;
    console.log(intro);
    try {
      db.getConnection(async (err, connection) => {
        const sql = `
            UPDATE user
            set intro = "${intro}"
            WHERE
            uid = '${uid}'
          `;
        connection.query(sql, (err, rows) => {
          console.log(rows);
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

  // profile 변경 정보 저장
  app.post("/api/user/updateProfile", async (req, res) => {
    console.log("profile update");
    const url = req.body.url;
    const uid = req.body.uid;
    try {
      db.getConnection(async (err, connection) => {
        const sql = `
            UPDATE user
            set profile_url = '${url}'
            WHERE
            uid = '${uid}'
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
