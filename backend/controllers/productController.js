const Product = require("../models/productModel");
const User = require("../models/userModel");
var cloudinary = require("cloudinary").v2;

const createProduct = async (req, res) => {
    try {
      const {
        productName,
        description,
        price,
        category,
        imgs,
        colors,
        questions,
        reviews,
        dimensions,
        weight,
        discount,
        availability,
      } = req.body;
  
      const userId = req.user._id.toString();
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if(user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to create product" });
      }
  
      // Validate mandatory fields
      if (!productName || !description || !price || !category) { //we must add validation of imgs here
        return res.status(400).json({ error: "Required fields are missing" });
      }
  
      // Log image data to identify issues with the path or format
      console.log("Received image data: ", imgs);
  
      let imgUrls = [];
      if (imgs && imgs.length > 0) {
        for (const img of imgs) {
          try {
            let uploadedResponse;
            if (img.startsWith('data:image')) {
              // Base64 string
              uploadedResponse = await cloudinary.uploader.upload(img, {
                folder: "Elegant_products",
              });
            } else if (img.startsWith('http')) {
              // URL
              uploadedResponse = await cloudinary.uploader.upload(img, {
                folder: "Elegant_products",
              });
            } else {
              // Local file path
              uploadedResponse = await cloudinary.uploader.upload(img, {
                folder: "Elegant_products",
              });
            }
            imgUrls.push(uploadedResponse.secure_url);
          } catch (uploadError) {
            console.error("Error uploading image: ", uploadError);
            return res.status(500).json({ error: "Failed to upload image" });
          }
        }
      }
  
      // Create new product with the provided data
      const newProduct = new Product({
        user: userId,
        productName,
        description,
        price,
        category,
        imgs: imgUrls,
        colors,
        questions,
        reviews,
        dimensions,
        weight,
        discount,
        availability,
      });
  
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error in createProduct controller: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this product" });
    }

    // Delete product images from Cloudinary
    if (product.imgs && product.imgs.length > 0) {
      for (const img of product.imgs) {
        const imgId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const userId = req.user._id; // Get the ID of the currently logged-in user
    const { productId } = req.params; // Get productId from the URL parameters

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product); // Return the product details
  } catch (error) {
    console.error("Error in getProductDetails controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const userId = req.user._id; // Get the ID of the currently logged-in user
    const { productId } = req.params; // Get productId from the URL parameters
    const updateData = req.body; // Get the updated product data from the request body

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the user is the creator or an admin
    if (product.user.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "You are not authorized to update this product" });
    }

    // Update product details
    Object.assign(product, updateData); // Merge the new data into the product
    await product.save(); // Save the updated product

    res.status(200).json(product); // Return the updated product
  } catch (error) {
    console.error("Error in updateProduct controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
  
  

const saveToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.user.toString() === userId.toString()) {
        return res.status(400).json({ error: "Owner cannot wish his own product" });
    }

    const userWishedProduct = product.wished.includes(userId);

    if (userWishedProduct) {
      // Remove from wishlist
      await Product.updateOne({ _id: productId }, { $pull: { wished: userId } });
      await User.updateOne({ _id: userId }, { $pull: { wishedProducts: productId } });

      const updatedWishes = product.wished.filter((id) => id.toString() !== userId.toString());
      res.status(200).json(updatedWishes);
    } else {
      // Add to wishlist
      product.wished.push(userId);
      await User.updateOne({ _id: userId }, { $push: { wishedProducts: productId } });
      await product.save();

    //   const notification = new Notification({
    //     from: userId,
    //     to: product.user,
    //     type: "wishlist",
    //   });
    //   await notification.save();

      const updatedWishes = product.wished;
      res.status(200).json(updatedWishes);
    }
  } catch (error) {
    console.log("Error in saveToWishlist controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "reviews.user",
        select: "-password",
      })
      .populate({
        path: "questions.user",
        select: "-password",
      });

    if (products.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getAllProducts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWishlist = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const wishedProducts = await Product.find({ _id: { $in: user.wishedProducts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "reviews.user",
        select: "-password",
      });

    res.status(200).json(wishedProducts);
  } catch (error) {
    console.log("Error in getWishlistProducts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const products = await Product.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("reviews.user", "-password");

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getAdminProducts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { text, rating } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate review fields
    if (!text || !rating) {
      return res.status(400).json({ error: "Review text and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(review => review.user.toString() === userId.toString());
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    // Add the review
    const newReview = {
      user: userId,
      text,
      rating,
    };
    product.reviews.push(newReview);
    await product.save();

    res.status(200).json(product.reviews);
  } catch (error) {
    console.error("Error in addReview controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addQuestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { question } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate question field
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Add the question
    const newQuestion = {
      user: userId,
      question,
    };
    product.questions.push(newQuestion);
    await product.save();

    res.status(200).json(product.questions);
  } catch (error) {
    console.error("Error in addQuestion controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, reviewId } = req.params; // Assume reviewId is passed as a route parameter
    const { text, rating } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find the review to edit
    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the review belongs to the user
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to edit this review" });
    }

    // Validate review fields
    if (text !== undefined) {
      review.text = text; // Update text if provided
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      review.rating = rating; // Update rating if provided
    }

    await product.save();

    res.status(200).json(review);
  } catch (error) {
    console.error("Error in editReview controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addAnswer = async (req, res) => {
  try {
    const userId = req.user._id; // Get the ID of the currently logged-in user
    const { productId, questionId } = req.params; // Get productId and questionId from the URL parameters
    const { answer } = req.body; // Get the answer from the request body

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Ensure the logged-in user is the owner of the product
    if (product.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to answer questions for this product" });
    }

    // Find the question to answer
    const question = product.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Add the answer to the question
    question.answer = answer; // Assuming the question schema has an 'answer' field
    await product.save(); // Save the updated product

    res.status(200).json(question); // Return the updated question with the answer
  } catch (error) {
    console.error("Error in addAnswer controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
  
  
  
  

module.exports = {
  createProduct,
  deleteProduct,
  getProductDetails,
  saveToWishlist,
  getAllProducts,
  updateProduct,
  getWishlist,
  getAdminProducts,
  addReview,
  editReview,
  addQuestion,
  addAnswer
};
