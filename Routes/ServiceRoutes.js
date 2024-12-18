const express = require("express");
const router = express.Router();
// const loginUser = require("../controller/userController");
// const logoutUser = require("../controller/userController");
// const refreshAccessToken = require("../controller/userController");
const serviceController = require("../controller/serviceController");
const verifyJWT = require("../middleware/authMiddleware");
const multer = require('multer');
const upload = multer();

router.route("/Services").post(verifyJWT, upload.fields([
    { name: 'file', maxCount: 10 },
    { name: 'logo', maxCount: 1 }
  ]), serviceController.createService);
router.route("/MultipleServices").post(verifyJWT, serviceController.createMultipleService)
router.route("/Services").get(serviceController.getServices);
router.route("/Services/:Service_Id").put(verifyJWT,upload.single('logo'),serviceController.updateService);
router.route("/Services/:Service_Id").get(serviceController.getOneService);
router.route("/Services/:Service_Id").delete(verifyJWT,serviceController.deleteService);
router.route("/Services/image/:image_id").delete(verifyJWT,serviceController.deleteImage);
router.route("/Services/image/:Service_Id").put(verifyJWT,upload.array('file'),serviceController.addImage);
module.exports = router;
