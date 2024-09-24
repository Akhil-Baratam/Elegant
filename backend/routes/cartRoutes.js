const express = require("express");
const protectRoute = require('../middleware/protectRoute');
const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/:productId", protectRoute, addToCart);
router.delete("/:productId", protectRoute, removeFromCart);
router.put("/:productId", protectRoute, updateCartQuantity);
router.get("/", protectRoute, getCart);

module.exports = router;
