const express = require("express");
const { createCoupon, applyCoupon, deleteCoupon, getAllCoupons } = require("../controllers/couponController");
const protectRoute = require("../middleware/protectRoute");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Admin routes
router.post("/create", protectRoute, isAdmin, createCoupon);
router.delete("/:couponId", protectRoute, isAdmin, deleteCoupon);
router.get("/", protectRoute, isAdmin, getAllCoupons);

// User routes
router.post("/apply", protectRoute, applyCoupon);

module.exports = router;
