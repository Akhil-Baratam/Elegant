const User = require('../models/userModel');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin only.' });
    }
  };

  module.exports = isAdmin;