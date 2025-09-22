const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrderById,
  getMyOrders,
  getShopOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/order');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules for order creation
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  
  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cash_on_delivery', 'credit_card', 'bank_transfer', 'wallet'])
    .withMessage('Invalid payment method'),
  
  body('notes.customerNotes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Customer notes cannot exceed 500 characters')
];

// Validation for order status update
const statusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status'),
  
  body('note')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Note cannot exceed 200 characters')
];

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get('/', verifyToken, requireRole('admin'), getOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private (Admin/Shop Owner)
router.get('/stats', verifyToken, getOrderStats);

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
// @access  Private
router.get('/my-orders', verifyToken, getMyOrders);

// @route   GET /api/orders/shop-orders
// @desc    Get shop's orders (Seller only)
// @access  Private (Seller)
router.get('/shop-orders', verifyToken, requireRole('seller', 'admin'), getShopOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private (Owner/Admin)
router.get('/:id', verifyToken, getOrderById);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', verifyToken, orderValidation, createOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Shop Owner/Admin)
router.put('/:id/status', verifyToken, statusValidation, updateOrderStatus);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private (Customer/Admin)
router.put('/:id/cancel', verifyToken, cancelOrder);

module.exports = router;
