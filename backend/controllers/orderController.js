// controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const newOrder = new Order({
    userId: req.user.id,
    products: req.body.products,
    amount: req.body.amount,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json('Order not found');

    if (order.status === 'Cancelled') return res.status(400).json('Order already cancelled');

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json('Order cancelled successfully');
  } catch (err) {
    res.status(500).json(err);
  }
};
