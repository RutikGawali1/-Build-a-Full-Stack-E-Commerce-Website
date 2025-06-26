// === models/User.js ===
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: [3, 'Name must be at least 3 characters'],
    match: [/^[a-zA-Z ]+$/, 'Enter a valid name (letters and spaces only)']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);
