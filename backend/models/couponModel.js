const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100, // percentage discount
    },
    maxDiscount: {
      type: Number,
    },
    minimumOrderValue: {
      type: Number,
      required: true, // Minimum cart value required to apply coupon
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who created the coupon
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
