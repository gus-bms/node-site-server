const mode = process.env.NODE_ENV || "Dev";
const port = process.env.port || 8000;

(async function () {
  const app = await require("./app");
  app.listen(8000, () => {
    console.log(`
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @                                           @
      @  🌚 ${mode} Server listening on PORT: ${port} 🌚 @
      @                                           @
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    `);
  });
})();
