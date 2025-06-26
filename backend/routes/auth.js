// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getUsers } = require('../controllers/authController');
const fetchUser = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/getusers', getUsers);
module.exports = router;

// controllers/cartController.js
const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: req.body.items } },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
};
