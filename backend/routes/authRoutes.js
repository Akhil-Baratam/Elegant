const express = require('express');
const { signup, login, logout, getMe } = require('../controllers/authController');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

module.exports = router; 