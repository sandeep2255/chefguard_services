const express = require("express");
const router = express.Router();
// const loginUser = require("../controller/userController");
// const logoutUser = require("../controller/userController");
// const refreshAccessToken = require("../controller/userController");
const serviceController = require("../controller/serviceController");
const verifyJWT = require("../middleware/authMiddleware");

router.route("/Services").post(verifyJWT, serviceController.createService);
router.route("/MultipleServices").post(verifyJWT, serviceController.createMultipleService)
router.route("/Services").get(serviceController.getServices);
router.route("/Services/:Service_Id").put(serviceController.updateService);
router.route("/Services/:Service_Id").get(serviceController.getOneService);
router.route("/Services/:Service_Id").delete(serviceController.deleteService);
module.exports = router;
