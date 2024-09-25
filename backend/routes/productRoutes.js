const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const isAdmin = require('../middleware/isAdmin');
const {
  createProduct,
  deleteProduct,
  getProductDetails,
  updateProduct,
  saveToWishlist,
  getAllProducts,
  getWishlist,
  getAdminProducts,
  addReview,
  addQuestion,
  editReview,
  addAnswer,
} = require('../controllers/productController');

const router = express.Router();

// Admin routes
router.get("/admin", protectRoute, isAdmin, getAdminProducts);
router.post("/create", protectRoute, isAdmin, createProduct);
router.delete("/:productId", protectRoute, isAdmin, deleteProduct);
router.put("/:productId", protectRoute, isAdmin, updateProduct);
router.post("/answer/:productId/:questionId", protectRoute, isAdmin, addAnswer);

// General product routes
router.get("/", protectRoute, getAllProducts);
router.get("/:productId", protectRoute, getProductDetails);
router.post("/wishProduct/:productId", protectRoute, saveToWishlist);
router.get("/wishlist/:id", protectRoute, getWishlist);

// Review and Question routes
router.post("/review/:productId", protectRoute, addReview);
router.post("/:productId/editReview/:reviewId", protectRoute, editReview);
router.post("/question/:productId", protectRoute, addQuestion);

module.exports = router;
