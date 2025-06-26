const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // For password hashing

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const User = require('./models/User'); // Ensure you have a User model

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    // 👇 Create default admin if not exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('✅ Default admin created: admin@example.com / admin123');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  })
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
