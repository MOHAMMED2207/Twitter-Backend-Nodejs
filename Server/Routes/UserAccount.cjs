const Express = require("express");
const UserControllr = require("../Controllers/UserControllrr.cjs");
const AUTH_MIDDLEWARES = require("../middlewares/authentication.cjs"); // Routes
const router = Express.Router();
// ------------------------------------------------------------------------------------
router.get(
  "api/user/profile",
  AUTH_MIDDLEWARES,
  UserControllr.getUserProfile
);
// ------------------------------------------------------------------------------------
router.get(
  "api/user/suggested",
  AUTH_MIDDLEWARES,
  UserControllr.getSuggestedUsers
);
// ------------------------------------------------------------------------------------
router.post(
  "api/user/follow/:id",
  AUTH_MIDDLEWARES,
  UserControllr.followUnfollowUser
);
// ------------------------------------------------------------------------------------
router.post("api/user/update", AUTH_MIDDLEWARES, UserControllr.updateUser);
// ------------------------------------------------------------------------------------

module.exports = router; //  Exports
