const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', getAllProducts);                   // Everyone
router.get('/:id', getProductById);                // Everyone

router.post('/', createProduct);      // Admin
router.put('/:id', verifyToken, updateProduct);    // Admin
router.delete('/:id', verifyToken, deleteProduct); // Admin


module.exports = router;


