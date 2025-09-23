const { validationResult } = require('express-validator');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Order = require('../models/Order');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Text search
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalUsers: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error while fetching users'
    });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private (Owner/Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if user can access this profile
    const canAccess = req.user.role === 'admin' || req.user.id === req.params.id;

    if (!canAccess) {
      return res.status(403).json({
        message: 'Not authorized to view this profile'
      });
    }

    // Get user's shop if exists
    let shop = null;
    if (user.role === 'seller') {
      shop = await Shop.findOne({ ownerId: user._id });
    }

    // Get user's order statistics
    const orderStats = await Order.getStats(null, user._id);

    res.json({
      user,
      shop,
      stats: orderStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        averageOrderValue: 0
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching user'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (Owner/Admin)
const updateUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check authorization
    const canUpdate = req.user.role === 'admin' || req.user.id === req.params.id;

    if (!canUpdate) {
      return res.status(403).json({
        message: 'Not authorized to update this profile'
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'address', 'avatar'
    ];

    // If admin, allow role and isActive updates
    if (req.user.role === 'admin') {
      allowedUpdates.push('role', 'isActive', 'isVerified');
    }

    // Update user
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      message: 'User profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating user'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private (Owner/Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check authorization
    const canDelete = req.user.role === 'admin' || req.user.id === req.params.id;

    if (!canDelete) {
      return res.status(403).json({
        message: 'Not authorized to delete this account'
      });
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    res.json({
      message: 'User account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Server error while deleting user'
    });
  }
};

// @desc    Change user password
// @route   PUT /api/users/:id/password
// @access  Private (Owner only)
const changePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Only allow users to change their own password
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: 'Not authorized to change this password'
      });
    }

    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Server error while changing password'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private (Owner/Admin)
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check authorization
    const canAccess = req.user.role === 'admin' || req.user.id === req.params.id;

    if (!canAccess) {
      return res.status(403).json({
        message: 'Not authorized to view these statistics'
      });
    }

    // Get order statistics
    const orderStats = await Order.getStats(null, user._id);
    
    // Get shop statistics if user is a seller
    let shopStats = null;
    if (user.role === 'seller') {
      const shop = await Shop.findOne({ ownerId: user._id });
      if (shop) {
        await shop.updateStats();
        shopStats = shop.stats;
      }
    }

    res.json({
      stats: {
        orders: orderStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
          averageOrderValue: 0
        },
        shop: shopStats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching user statistics'
    });
  }
};

// @desc    Toggle user active status (Admin only)
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    res.status(500).json({
      message: 'Server error while toggling user status'
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  getUserStats,
  toggleUserStatus
};
