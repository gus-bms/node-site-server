const { dbHost, dbUser, dbPassword } = require("../config.js");
const mariadb = require("mariadb");
var mysql = require("mysql");
const dbConfig = {
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  port: 3306,
  database: "site",
  charset: "utf8mb4",
  connectionLimit: 500,
};

var connectionCount = 0;
exports.connection = (async function () {
  try {
    console.log(dbHost);
    var pool = await mysql.createPool(dbConfig);
    console.log(pool);
    pool.on("acquire", function (connection) {
      console.log(
        `Connection ${
          connection.threadId
        } acquired connection count - ${++connectionCount}`
      );
    });
    pool.on("connection", function (connection) {
      console.log(
        `Connection ${connection.threadId} created connection count - ${connectionCount}`
      );
    });
    pool.on("enqueue", function () {
      console.log("Waiting for available connection slot");
    });
    pool.on("release", function (connection) {
      console.log(
        `Connection ${
          connection.threadId
        } released connection count - ${--connectionCount}`
      );
    });

    return pool;
  } catch (e) {
    console.error("Failed to make all database connections!", e);
    throw e;
  }
})();
