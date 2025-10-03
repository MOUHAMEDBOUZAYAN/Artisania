const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/product');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules for product creation/update
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  
  body('category')
    .isIn([
      'ceramics', 'textiles', 'jewelry', 'painting', 'woodwork',
      'metalwork', 'glasswork', 'leatherwork', 'pottery', 'sculpture', 'food', 'other'
    ])
    .withMessage('Invalid product category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
  
  body('specifications.materials')
    .optional()
    .isArray()
    .withMessage('Materials must be an array'),
  
  body('specifications.colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array')
];

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/search/:query
// @desc    Search products
// @access  Public
router.get('/search/:query', searchProducts);

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', getProductsByCategory);

// @route   GET /api/products/my-products
// @desc    Get current user's products
// @access  Private (Seller)
router.get('/my-products', verifyToken, requireRole('seller', 'admin'), getMyProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Seller)
router.post('/', verifyToken, requireRole('seller', 'admin'), productValidation, createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Owner/Admin)
router.put('/:id', verifyToken, productValidation, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Owner/Admin)
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
