const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { createProduct, deleteProduct, getProductDetails, updateProduct, saveToWishlist, getAllProducts, getWishlist, getUserProducts, addReview, addQuestion, editReview, addAnswer } = require('../controllers/productController');


const router = express.Router();

router.get("/", protectRoute, getAllProducts);
router.get("/:productId", protectRoute, getProductDetails);
router.post("/create", protectRoute, createProduct);
router.delete("/:productId", protectRoute, deleteProduct);
router.put("/:productId", protectRoute, updateProduct);

router.post("/wishProduct/:productId", protectRoute, saveToWishlist);
router.get("/wishlist/:id", protectRoute, getWishlist);
router.get("/user/:username", protectRoute, getUserProducts);

router.post("/review/:productId", protectRoute, addReview);
router.post("/:productId/editReview/:reviewId", protectRoute, editReview);
router.post("/question/:productId", protectRoute, addQuestion);
router.post("/:productId/question/:questionId", protectRoute, addAnswer);
 

module.exports = router; 