const result = require('dotenv').config({ path: './.env' });
console.log('📁 Dotenv result:', result);

const app = require('./app');
const connectDB = require('./config/database');

// Log Cloudinary config
console.log('🔧 Cloudinary config check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined'
});

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
  console.log(`
  🚀 Server is running on port ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}
  🔗 API Base URL: http://localhost:${PORT}/api
  
  📚 Available endpoints:
  • Auth: http://localhost:${PORT}/api/auth
  • Products: http://localhost:${PORT}/api/products
  • Shops: http://localhost:${PORT}/api/shops
  • Orders: http://localhost:${PORT}/api/orders
  • Users: http://localhost:${PORT}/api/users
  • Upload: http://localhost:${PORT}/api/upload
  
  💡 Health check: http://localhost:${PORT}/health
  `);
});
