// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
