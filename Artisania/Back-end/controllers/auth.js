const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'Mouhamed12@';
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, role, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'customer',
      phone: phone || undefined,
      address: address || undefined
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, timestamp: new Date() });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    console.log('Looking for user with email:', email);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    console.log('User found:', { id: user._id, email: user.email, isActive: user.isActive });

    if (!user.isActive) {
      console.log('User account is deactivated');
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    console.log('Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    console.log('Password is valid, updating last login...');
    user.lastLogin = new Date();
    await user.save();

    console.log('Generating token...');
    const token = generateToken(user._id);
    console.log('Token generated successfully');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

const logout = async (req, res) => {
  try {
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout'
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const Product = require('../models/Product');
    const Order = require('../models/Order');
    const Shop = require('../models/Shop');
    
    const [totalProducts, totalOrders, shop] = await Promise.all([
      Product.countDocuments({ ownerId: userId, isActive: true }),
      Order.countDocuments({ 'items.shopId': { $exists: true } }),
      Shop.findOne({ ownerId: userId })
    ]);
    
    const totalRevenue = 0;
    const totalCustomers = 0;
    
    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching dashboard stats'
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const Order = require('../models/Order');
    
    const recentOrders = await Order.find({ 'items.shopId': { $exists: true } })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber total status createdAt customerId');
    
    const formattedOrders = recentOrders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      customerName: order.customerId ? `${order.customerId.firstName} ${order.customerId.lastName}` : 'Client inconnu',
      createdAt: order.createdAt
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({
      message: 'Server error while fetching recent orders'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  getDashboardStats,
  getRecentOrders
};
