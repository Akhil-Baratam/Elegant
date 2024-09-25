const express = require("express");
const protectRoute = require('../middleware/protectRoute');
const { makeOrder, getUserOrders, getOrderbyId } = require("../controllers/orderController");

const router = express.Router();

router.post("/order", protectRoute, makeOrder);
router.delete("/orders", protectRoute, getUserOrders);
router.get("/:orderId", protectRoute, getOrderbyId);

module.exports = router;
