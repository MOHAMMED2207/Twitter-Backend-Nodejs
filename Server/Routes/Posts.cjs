const Express = require("express");
const POSTControllr = require("../Controllers/POSTControllr.cjs");
const AUTH_MIDDLEWARES = require("../middlewares/authentication.cjs"); // Routes

const router = Express.Router();

router.post("api/post/create", AUTH_MIDDLEWARES, POSTControllr.createPost);
router.delete(
  "api/post/delete/:id",
  AUTH_MIDDLEWARES,
  POSTControllr.deletePost
);
router.post(
  "api/post/comment/:id",
  AUTH_MIDDLEWARES,
  POSTControllr.commentOnPost
);
router.post(
  "api/post/like/:id",
  AUTH_MIDDLEWARES,
  POSTControllr.likeUnlikePost
);
router.get("api/post/all", AUTH_MIDDLEWARES, POSTControllr.getAllPosts);
router.get("api/post/likes/:id", AUTH_MIDDLEWARES, POSTControllr.getLikedPosts);
router.get(
  "api/post/following",
  AUTH_MIDDLEWARES,
  POSTControllr.getFollowingPosts
);
router.get(
  "api/post/user/:username",
  AUTH_MIDDLEWARES,
  POSTControllr.getUserPosts
);

module.exports = router; //  Exports
