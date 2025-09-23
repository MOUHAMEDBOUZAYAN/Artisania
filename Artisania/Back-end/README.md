# 🎨 Artisania Backend API

## 📋 Overview
Complete backend API for Artisania marketplace - a platform connecting artisans with customers for authentic handmade products.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/artisania

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 📚 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| POST | `/api/auth/logout` | User logout | Private |

### 🛍️ Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/products` | Get all products with filters | Public |
| GET | `/api/products/search/:query` | Search products | Public |
| GET | `/api/products/category/:category` | Get products by category | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| GET | `/api/products/my-products` | Get my products | Seller/Admin |
| POST | `/api/products` | Create new product | Seller/Admin |
| PUT | `/api/products/:id` | Update product | Owner/Admin |
| DELETE | `/api/products/:id` | Delete product | Owner/Admin |

### 🏪 Shops
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/shops` | Get all shops with filters | Public |
| GET | `/api/shops/featured` | Get featured shops | Public |
| GET | `/api/shops/search/:query` | Search shops | Public |
| GET | `/api/shops/category/:category` | Get shops by category | Public |
| GET | `/api/shops/:id` | Get shop by ID | Public |
| GET | `/api/shops/:id/products` | Get shop products | Public |
| GET | `/api/shops/my-shop` | Get my shop | Seller/Admin |
| POST | `/api/shops` | Create new shop | Seller/Admin |
| PUT | `/api/shops/:id` | Update shop | Owner/Admin |
| PUT | `/api/shops/:id/stats` | Update shop stats | Owner/Admin |

### 📦 Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/stats` | Get order statistics | Admin/Shop Owner |
| GET | `/api/orders/my-orders` | Get user's orders | Private |
| GET | `/api/orders/shop-orders` | Get shop's orders | Seller/Admin |
| GET | `/api/orders/:id` | Get order by ID | Owner/Admin |
| POST | `/api/orders` | Create new order | Private |
| PUT | `/api/orders/:id/status` | Update order status | Shop Owner/Admin |
| PUT | `/api/orders/:id/cancel` | Cancel order | Customer/Admin |

### 👥 Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user profile | Owner/Admin |
| GET | `/api/users/:id/stats` | Get user statistics | Owner/Admin |
| PUT | `/api/users/:id` | Update user profile | Owner/Admin |
| PUT | `/api/users/:id/password` | Change password | Owner |
| PUT | `/api/users/:id/toggle-status` | Toggle user status | Admin |
| DELETE | `/api/users/:id` | Delete user account | Owner/Admin |

## 🛡️ Authentication & Authorization

### JWT Token
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **buyer**: Can browse, search, and purchase products
- **seller**: Can create/manage shops and products
- **admin**: Full system access

## 📝 Example Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "أحمد",
    "lastName": "محمد",
    "email": "ahmed@example.com",
    "password": "Password123",
    "role": "buyer",
    "phone": "+212612345678"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "Password123"
  }'
```

### Create Shop
```bash
curl -X POST http://localhost:5000/api/shops \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "محل الحرف اليدوية",
    "description": "متخصص في المنتجات اليدوية التقليدية",
    "categories": ["handicrafts", "textiles"]
  }'
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "سجادة يدوية",
    "description": "سجادة تقليدية مصنوعة يدوياً",
    "price": 1500,
    "category": "textiles",
    "stock": 5,
    "shopId": "<shop_id>"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "items": [
      {
        "productId": "<product_id>",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "firstName": "أحمد",
      "lastName": "محمد",
      "street": "شارع الحسن الثاني",
      "city": "الرباط",
      "postalCode": "10000",
      "phone": "+212612345678"
    },
    "paymentMethod": "cash_on_delivery"
  }'
```

## 🏗️ Project Structure

```
Back-end/
├── controllers/          # Route controllers
│   ├── auth.js          # Authentication logic
│   ├── user.js          # User management
│   ├── product.js       # Product management
│   ├── shop.js          # Shop management
│   └── order.js         # Order management
├── models/              # Database models
│   ├── User.js          # User schema
│   ├── Product.js       # Product schema
│   ├── Shop.js          # Shop schema
│   └── Order.js         # Order schema
├── routes/              # API routes
│   ├── auth.js          # Auth routes
│   ├── user.js          # User routes
│   ├── product.js       # Product routes
│   ├── shop.js          # Shop routes
│   └── order.js         # Order routes
├── middleware/          # Custom middleware
│   └── auth.js          # Authentication middleware
├── config/              # Configuration files
│   └── database.js      # Database connection
├── app.js               # Express app configuration
├── server.js            # Server entry point
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md           # Documentation
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## 🎯 Features

### ✅ Implemented
- 🔐 **Complete Authentication System** (JWT-based)
- 👥 **User Management** (CRUD operations)
- 🛍️ **Product Management** (with search, filters, categories)
- 🏪 **Shop Management** (for sellers)
- 📦 **Order Management** (full lifecycle)
- 📊 **Statistics & Analytics**
- 🛡️ **Role-based Access Control**
- ✅ **Input Validation** (express-validator)
- 🔒 **Password Hashing** (bcrypt)
- 🌐 **CORS Configuration**

### 🚀 Ready for Production
- 📈 **Pagination & Filtering**
- 🔍 **Advanced Search**
- 📱 **RESTful API Design**
- ⚡ **Performance Optimized**
- 🛠️ **Error Handling**
- 📝 **Comprehensive Documentation**

## 🌍 Supported Languages
- Arabic (Primary)
- French
- English

## 📄 License
MIT License - see LICENSE file for details

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ for the Artisania Community**