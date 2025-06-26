const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Make sure you have this model

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.product');
    
    if (!cart) {
      return res.json({ items: [] });
    }

    // Filter out items with null products (deleted products)
    const validItems = cart.items.filter(item => item.product !== null);
    
    // Update cart if items were filtered out
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({ items: cart.items });
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const quantity = parseInt(req.body.quantity, 10) || 1;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      if (!Array.isArray(cart.items)) {
        cart.items = [];
      }

      const existingItemIndex = cart.items.findIndex(
        item => item.product && item.product.toString() === productId
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.status(201).json({ items: cart.items });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: req.body.items } },
      { new: true, upsert: true }
    ).populate('items.product');
    
    res.json({ items: cart.items });
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json({ items: cart.items });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    res.status(500).json({ message: 'Error updating cart quantity', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json({ items: cart.items });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true, upsert: true }
    );
    
    res.json({ items: cart.items });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};