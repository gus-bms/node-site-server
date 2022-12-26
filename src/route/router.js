const spot = require("../services/spot.js");
const user = require("../services/user.js");
module.exports = async function (app) {
  await spot(app);
  await user(app);
};
