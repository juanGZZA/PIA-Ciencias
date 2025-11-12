const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Increase body size limits to allow base64 image payloads from the demo frontend.
// For production use multipart/form-data with streaming (multer or similar) instead of large JSON bodies.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  try {
    const usersCount = db.get('users').size().value();
    res.send({ status: 'ok', users: usersCount });
  } catch (e) {
    res.status(500).send({ status: 'error' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});