// === controllers/authController.js (with validation) ===
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
var verifyToken = require('../middleware/authMiddleware')

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation checks
  if (!name || name.trim().length < 3) {
    return res.status(400).json('Name must be at least 3 characters long');
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json('Invalid email format');
  }

  if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return res.status(400).json(
      'Password must be at least 6 characters long, include an uppercase letter and a number'
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};