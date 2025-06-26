const Product = require('../models/Product');

// 🟢 Get all products (accessible by all users)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get single product by ID (accessible by all users)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟠 Create product (admin only)
exports.createProduct = async (req, res) => {
  // if (!req.user.isAdmin) return res.status(403).json('Access denied');

  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟠 Update product (admin only)
exports.updateProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json('Access denied');

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟠 Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json('Access denied');

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};   
