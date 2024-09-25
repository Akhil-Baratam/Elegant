const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: Number,
      name: String,
      image: String,
    },
  ],
  total: Number, 
  subtotal: Number,
  shippingMode: {
    method: String,
    cost: Number,
  },
  contactInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
  },
  shippingAddress: {
    address: String,
    city: String,
    country: String,
    state: String,
    zipCode: String,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: { type: String, default: 'Pending' },
  orderCode: String,
  createdAt: { type: Date, default: Date.now },
},
{
  timestamps: true,
});
  
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
