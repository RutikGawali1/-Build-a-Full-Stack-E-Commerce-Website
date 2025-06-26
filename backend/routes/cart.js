const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/getCart', verifyToken, getCart);

router.post('/add', verifyToken, addToCart);

router.post('/update', verifyToken, updateCart);

router.put('/update-quantity', verifyToken, updateCartQuantity);

router.delete('/remove/:productId', verifyToken, removeFromCart);

router.delete('/clear', verifyToken, clearCart);

module.exports = router;