const app = require('./app');
const connectDB = require('./config/database');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Start server
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
  
  💡 Health check: http://localhost:${PORT}/health
  `);
});
