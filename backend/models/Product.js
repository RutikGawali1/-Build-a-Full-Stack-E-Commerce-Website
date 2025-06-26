const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const ProductSchema = new Schema({
  productId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
});

module.exports = mongoose.model('Product', ProductSchema);