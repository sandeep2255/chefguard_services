const express = require("express");
const router = express.Router();
// const loginUser = require("../controller/userController");
// const logoutUser = require("../controller/userController");
// const refreshAccessToken = require("../controller/userController");
const userController = require("../controller/userController");
const verifyJWT = require("../middleware/authMiddleware");
const productController = require('../controller/productController')
const multer = require('multer');
const upload = multer();

router.route("/Products").post(verifyJWT,upload.array('file'), productController.createProduct);
router.route("/MultipleProducts").post(verifyJWT, productController.createMultipleProducts)
router.route("/Offer").post(verifyJWT,productController.createOffer);
router.route("/Products").get(productController.getProducts);
router.route("/Products/:Product_Id").put(verifyJWT,productController.updateProducts);
router.route("/Products/:Product_Id").get(productController.getOneProducts);
router.route("/Products/:Product_Id").delete(verifyJWT,productController.deleteProduct);
router.route("/Products/image/:image_id").delete(verifyJWT,productController.deleteImage);
router.route("/Products/image/:Product_Id").put(verifyJWT, upload.array('file'),productController.addImage);
module.exports = router;
