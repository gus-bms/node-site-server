const mode = process.env.NODE_ENV || "development";
const config = require("./config.json")[mode];

module.exports = config;
