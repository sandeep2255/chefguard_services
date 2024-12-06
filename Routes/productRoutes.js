const express = require("express");
const router = express.Router();
// const loginUser = require("../controller/userController");
// const logoutUser = require("../controller/userController");
// const refreshAccessToken = require("../controller/userController");
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/authMiddleware");
const productController = require('../controller/productController')

router.route("/Products").post(verifyJWT, productController.createProduct);
router.route("/MultipleProducts").post(verifyJWT, productController.createMultipleProducts)
router.route("/Offer").post(verifyJWT,productController.createOffer);
router.route("/Products").get(productController.getProducts);
router.route("/Products/:Product_Id").put(productController.updateProducts);
router.route("/Products/:Product_Id").get(productController.getOneProducts);
router.route("/Products/:Product_Id").delete(productController.deleteProduct);
module.exports = router;
