module.exports = async function (app) {
  const db = await require("../db/db").connection;

  app.get("/api/selectSpotList", async function (req, res) {
    db.getConnection(async (err, connection) => {
      try {
        console.log("hi");
        const query = util.promisify(connection.query).bind(connection);
        const sql = `
              SELECT *
              FROM SPOT 
              WHERE 1=1
          `;
        await query(sql);
        connection.release();
        res.json({ r: true });
      } catch (error) {
        console.log("Query Error", error);
        connection.release;
        res.json({ r: false });
      }
    });
  });
};
