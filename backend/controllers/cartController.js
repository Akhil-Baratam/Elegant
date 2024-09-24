const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ user: userId, items: [] }); // Ensure items is initialized
    }

    // Ensure items is initialized
    if (!cart.items) {
      cart.items = []; // Initialize if undefined
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      // Update the quantity if the product is already in the cart
      return res.status(404).json({ error: "Product already exisits in the cart" });
    } else {
      // Add the new product to the cart
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCart controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Remove the product from the cart
    cart.items = cart.items.filter( // Updated here
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in removeFromCart controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Update product quantity in cart
const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params; // Product ID from the route
    const { quantity } = req.body; // New quantity from request body

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the item in the cart
    const itemInCart = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!itemInCart) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update the quantity
    itemInCart.quantity = quantity;

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in updateCartQuantity controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product"); // Updated here
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
};
