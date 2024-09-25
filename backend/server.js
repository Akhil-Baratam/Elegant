const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectMongoDB = require("./db/connectMongoDB");
const cookieParser = require('cookie-parser')
var cloudinary = require('cloudinary').v2;

dotenv.config(); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
// }));  // Enable CORS for all routes

app.use(express.json({ limit: "10mb" }));
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/products', require("./routes/productRoutes"));
app.use('/api/cart', require("./routes/cartRoutes"));
app.use('/api/orders', require("./routes/orderRoutes"));
app.use('/api/coupons', require("./routes/couponRoutes"));
// app.use('/api/notifications', require("./routes/notificationRoutes"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    connectMongoDB();
})


 