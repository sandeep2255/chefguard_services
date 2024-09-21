const express = require("express");
const router = express.Router();
// const loginUser = require("../controller/userController");
// const logoutUser = require("../controller/userController");
// const refreshAccessToken = require("../controller/userController");
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/authMiddleware");

router.route("/login").post(userController.loginUser);
router.route("/logout").post(verifyJWT, userController.logoutUser);
router.route("/refresh-token").post(userController.refreshAccessToken);

module.exports = router;
