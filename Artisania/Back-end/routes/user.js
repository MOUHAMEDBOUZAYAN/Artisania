const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getUserStats,
  toggleUserStatus
} = require('../controllers/user');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules for user profile update
const userUpdateValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please enter a valid phone number'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('address.postalCode')
    .optional()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Postal code must be between 3 and 10 characters'),
  
  body('address.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'admin'])
    .withMessage('Invalid role'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('isVerified')
    .optional()
    .isBoolean()
    .withMessage('isVerified must be a boolean')
];

// Validation for password change
const passwordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', verifyToken, requireRole('admin'), getUsers);

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private (Owner/Admin)
router.get('/:id', verifyToken, getUserById);

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Private (Owner/Admin)
router.get('/:id/stats', verifyToken, getUserStats);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Owner/Admin)
router.put('/:id', verifyToken, userUpdateValidation, updateUser);

// @route   PUT /api/users/:id/password
// @desc    Change user password
// @access  Private (Owner only)
router.put('/:id/password', verifyToken, passwordValidation, changePassword);

// @route   PUT /api/users/:id/toggle-status
// @desc    Toggle user active status (Admin only)
// @access  Private (Admin)
router.put('/:id/toggle-status', verifyToken, requireRole('admin'), toggleUserStatus);

// @route   DELETE /api/users/:id
// @desc    Delete user account
// @access  Private (Owner/Admin)
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
