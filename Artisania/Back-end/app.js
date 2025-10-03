require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const shopRoutes = require('./routes/shop');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const uploadRoutes = require('./routes/upload');

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Artisania API',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      shops: '/api/shops',
      orders: '/api/orders',
      users: '/api/users',
      upload: '/api/upload'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = app;