const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    address: String,
    city: String,
    country: String,
    state: String,
    zipCode: String,
  },
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },
    profileImg: {
      type: String,
      default: "",
    },
    wishedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      }
    ],
    addresses:[addressSchema],
    totalSales: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
