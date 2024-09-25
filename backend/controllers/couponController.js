const Coupon = require("../models/couponModel");

// Create a coupon (admin only)
const createCoupon = async (req, res) => {
  try {
    const { code, discount, maxDiscount, minimumOrderValue, expiryDate } = req.body;
    const newCoupon = new Coupon({
      code,
      discount,
      maxDiscount,
      minimumOrderValue,
      expiryDate,
      createdBy: req.user._id, // Admin ID
    });

    if (code.length < 6) {
      return res.status(400).json({ error: "Coupon code must be at least 6 characters long" });
    }

    await newCoupon.save();
    res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error("Error creating coupon: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply coupon (user only)
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid or expired coupon" });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    if (cartTotal < coupon.minimumOrderValue) {
      return res.status(400).json({ error: `Minimum order value of ${coupon.minimumOrderValue} is required to apply this coupon` });
    }

    const discountAmount = Math.min(
      (coupon.discount / 100) * cartTotal,
      coupon.maxDiscount
    );

    const finalAmount = cartTotal - discountAmount;

    res.status(200).json({ message: "Coupon applied", discountAmount, finalAmount });
  } catch (error) {
    console.error("Error applying coupon: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a coupon (admin only)
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    await Coupon.findByIdAndDelete(couponId);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all coupons (admin only)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    console.error("Error fetching coupons: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCoupon,
  applyCoupon,
  deleteCoupon,
  getAllCoupons,
};
