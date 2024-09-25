const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const makeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    console.log("Cart Data: ", cart); // Log the cart
    if (!cart || cart.items.length === 0) return res.status(400).send('Cart is empty');

    const {
      shipping,
      contactInfo,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Log shipping information
    console.log("Shipping: ", shipping);
    const shippingCost = shipping && shipping.cost ? shipping.cost : 0;
    console.log("Shipping Cost: ", shippingCost);
    
    console.log("Cart Total: ", cart.total);
    const totalAmount = cart.total + shippingCost;

    if (isNaN(totalAmount)) {
      return res.status(400).send('Total amount is invalid');
    }

    const order = new Order({
      user: userId,
      items: cart.items,
      subtotal: cart.total,
      shipping,
      total: totalAmount,
      contactInfo,
      shippingAddress,
      paymentMethod,
      orderCode: Math.random().toString(36).substr(2, 9).toUpperCase(),
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order: ", error); // Log any errors
    res.status(500).json({ error: "Internal server error" });
  }
};


const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};

const getOrderbyId = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) return res.status(404).send('Order not found');
  res.json(order);
};


module.exports = {
  makeOrder,
  getUserOrders,
  getOrderbyId,
};