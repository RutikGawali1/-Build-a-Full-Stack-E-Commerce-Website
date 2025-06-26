const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ]
}, {
  timestamps: true
});

// Index for faster queries
CartSchema.index({ userId: 1 });

// Remove items with null products before saving
CartSchema.pre('save', function(next) {
  this.items = this.items.filter(item => item.product !== null);
  next();
});

module.exports = mongoose.model('Cart', CartSchema);