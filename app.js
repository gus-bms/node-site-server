const express = require("express");
const cors = require("cors");

module.exports = (async () => {
  const app = express();
  const routes = require("./src/route/router");
  const corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  };
  app.use(cors({ credentials: true, origin: corsOptions }));
  app.use(express.urlencoded({ extended: true, limit: 52428800000 }));
  app.use(express.json({ limit: 52428800000 }));

  app.get("/hello", function (req, res) {
    res.json({ hello: "hello" });
  });

  process.on("uncaughtException", (err) => {
    console.log("a");
    console.error(err);

    // retruen것이 없기 때문에 process를 종료시켜 줘야함돠!
    process.exit(1);
  });

  await routes(app);

  return app;
})();
