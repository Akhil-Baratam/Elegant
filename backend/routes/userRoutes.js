const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { updateUser } = require('../controllers/userController');

const router = express.Router();

router.post("/update", protectRoute , updateUser);

module.exports = router;
 