const express = require("express");
const router = express.Router();
// const loginUser = require("../controller/userController");
// const logoutUser = require("../controller/userController");
// const refreshAccessToken = require("../controller/userController");
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/authMiddleware");
const productController = require('../controller/productController')

router.route("/createProducts").post(verifyJWT, productController.createProduct);
router.route("/createOffer").post(verifyJWT,productController.createOffer);
module.exports = router;
