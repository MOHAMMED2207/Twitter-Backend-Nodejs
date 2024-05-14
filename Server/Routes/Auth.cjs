const Express = require("express");
const AuthControllr = require("../Controllers/AuthControllr.cjs");
const AUTH_MIDDLEWARES = require("../middlewares/authentication.cjs"); // Routes
const router = Express.Router(); // Routes

router.get("api/auth/register", AuthControllr.GetAllUser); //
router.get(
  "api/auth/register/:id",
  AUTH_MIDDLEWARES,
  AuthControllr.GetUserProfile
); //
router.post("api/auth/register", AuthControllr.register); //
// ...........................................................................................................
router.post("api/auth/login", AuthControllr.login); //
// ...........................................................................................................
router.post("api/auth/logout", AuthControllr.logout); //

module.exports = router; //  Exports
