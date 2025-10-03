const express = require('express');
const { body } = require('express-validator');
const {
  getShops,
  getShopById,
  getShopsByCategory,
  searchShops,
  getFeaturedShops,
  createShop,
  updateShop,
  getMyShop,
  getShopProducts,
  updateShopStats
} = require('../controllers/shop');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules for shop creation/update
const shopValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required')
    .isLength({ max: 100 })
    .withMessage('Shop name cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Shop description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('email')
    .optional()
    .custom((value) => {
      if (value && value !== '' && value !== '@') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error('Please enter a valid email');
        }
      }
      return true;
    }),
  
  body('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('address.street')
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.country')
    .notEmpty()
    .withMessage('Country is required'),
  
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  
  body('categories.*')
    .optional()
    .isIn([
      'ceramics', 'textiles', 'jewelry', 'painting', 'woodwork',
      'metalwork', 'glasswork', 'leatherwork', 'pottery', 'sculpture', 'other'
    ])
    .withMessage('Invalid category'),
  
  body('businessInfo.businessType')
    .optional()
    .isIn(['individual', 'company'])
    .withMessage('Business type must be individual or company'),
  
  body('businessInfo.foundedYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid founded year'),
  
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook URL must be valid'),
  
  body('socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be valid'),
  
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be valid'),
  
  body('socialMedia.youtube')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be valid')
];

// @route   GET /api/shops
// @desc    Get all shops with filtering and pagination
// @access  Public
router.get('/', getShops);

// @route   GET /api/shops/featured
// @desc    Get featured shops
// @access  Public
router.get('/featured', getFeaturedShops);

// @route   GET /api/shops/search/:query
// @desc    Search shops
// @access  Public
router.get('/search/:query', searchShops);

// @route   GET /api/shops/category/:category
// @desc    Get shops by category
// @access  Public
router.get('/category/:category', getShopsByCategory);

// @route   GET /api/shops/my-shop
// @desc    Get current user's shop
// @access  Private (Seller)
router.get('/my-shop', verifyToken, requireRole('seller', 'admin'), getMyShop);

// @route   GET /api/shops/:id
// @desc    Get single shop by ID
// @access  Public
router.get('/:id', getShopById);

// @route   GET /api/shops/:id/products
// @desc    Get shop products
// @access  Public
router.get('/:id/products', getShopProducts);

// @route   POST /api/shops
// @desc    Create new shop
// @access  Private (Seller)
router.post('/', verifyToken, requireRole('seller', 'admin'), shopValidation, createShop);

// @route   PUT /api/shops/:id
// @desc    Update shop
// @access  Private (Owner/Admin)
router.put('/:id', verifyToken, shopValidation, updateShop);

// @route   PUT /api/shops/:id/stats
// @desc    Update shop statistics
// @access  Private (Owner/Admin)
router.put('/:id/stats', verifyToken, updateShopStats);

module.exports = router;
