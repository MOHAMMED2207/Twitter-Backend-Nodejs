const Express = require("express");
const POSTControllr = require("../Controllers/POSTControllr.cjs");
const AUTH_MIDDLEWARES = require("../middlewares/authentication.cjs"); // Routes

const router = Express.Router();

router.post("/post/create", AUTH_MIDDLEWARES, POSTControllr.createPost);
router.delete(
  "/post/delete/:id",
  AUTH_MIDDLEWARES,
  POSTControllr.deletePost
);
router.post(
  "/post/comment/:id",
  AUTH_MIDDLEWARES,
  POSTControllr.commentOnPost
);
router.post(
  "/post/like/:id",
  AUTH_MIDDLEWARES,
  POSTControllr.likeUnlikePost
);
router.get("/post/all", AUTH_MIDDLEWARES, POSTControllr.getAllPosts);
router.get("/post/likes/:id", AUTH_MIDDLEWARES, POSTControllr.getLikedPosts);
router.get(
  "/post/following",
  AUTH_MIDDLEWARES,
  POSTControllr.getFollowingPosts
);
router.get(
  "/post/user/:username",
  AUTH_MIDDLEWARES,
  POSTControllr.getUserPosts
);

module.exports = router; //  Exports
