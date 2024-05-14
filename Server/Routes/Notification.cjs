const Express = require("express");
const AuthControllr = require("../Controllers/NotificationController.cjs");
const AUTH_MIDDLEWARES = require("../middlewares/authentication.cjs"); // Routes

const router = Express.Router();

router.get("/", AUTH_MIDDLEWARES, AuthControllr.getNotifications);
router.delete("/", AUTH_MIDDLEWARES, AuthControllr.deleteNotifications);

export default router;
