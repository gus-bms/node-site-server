const spot = require("../services/spot.js");
const user = require("../services/user.js");
const log = require("../services/log.js");

module.exports = async function (app) {
  await spot(app);
  await user(app);
  await log(app);
};
