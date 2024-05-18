const Express = require("express");
const UserControllr = require("../Controllers/UserControllrr.cjs");
const AUTH_MIDDLEWARES = require("../middlewares/authentication.cjs"); // Routes
const router = Express.Router();
// ------------------------------------------------------------------------------------
router.get(
  "/user/profile",
  AUTH_MIDDLEWARES,
  UserControllr.getUserProfile
);
// ------------------------------------------------------------------------------------
router.get(
  "/user/suggested",
  AUTH_MIDDLEWARES,
  UserControllr.getSuggestedUsers
);
// ------------------------------------------------------------------------------------
router.post(
  "/user/follow/:id",
  AUTH_MIDDLEWARES,
  UserControllr.followUnfollowUser
);
// ------------------------------------------------------------------------------------
router.post("/user/update", AUTH_MIDDLEWARES, UserControllr.updateUser);
// ------------------------------------------------------------------------------------

module.exports = router; //  Exports
