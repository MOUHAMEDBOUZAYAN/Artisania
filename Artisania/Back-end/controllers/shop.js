const { validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const Product = require('../models/Product');

// @desc    Get all shops with filtering and pagination
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = 'rating.average',
      sortOrder = 'desc',
      featured,
      verified
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.categories = category;
    if (featured === 'true') filter.isFeatured = true;
    if (verified === 'true') filter.isVerified = true;
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (search) sort.score = { $meta: 'textScore' };

    const shops = await Shop.find(filter)
      .populate('ownerId', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Shop.countDocuments(filter);

    res.json({
      shops,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalShops: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({
      message: 'Server error while fetching shops'
    });
  }
};

// @desc    Get single shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('ownerId', 'firstName lastName avatar email phone');

    if (!shop || !shop.isActive) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

    // Get shop products
    const products = await Product.find({ 
      shopId: shop._id, 
      isActive: true 
    })
    .limit(8)
    .sort({ createdAt: -1 });

    res.json({ 
      shop,
      recentProducts: products
    });
  } catch (error) {
    console.error('Get shop error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching shop'
    });
  }
};

// @desc    Get shops by category
// @route   GET /api/shops/category/:category
// @access  Public
const getShopsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const shops = await Shop.getByCategory(category, Number(limit));

    res.json({
      category,
      shops,
      count: shops.length
    });
  } catch (error) {
    console.error('Get shops by category error:', error);
    res.status(500).json({
      message: 'Server error while fetching shops by category'
    });
  }
};

// @desc    Search shops
// @route   GET /api/shops/search/:query
// @access  Public
const searchShops = async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const shops = await Shop.searchShops(query, Number(limit));

    res.json({
      query,
      shops,
      count: shops.length
    });
  } catch (error) {
    console.error('Search shops error:', error);
    res.status(500).json({
      message: 'Server error while searching shops'
    });
  }
};

// @desc    Get featured shops
// @route   GET /api/shops/featured
// @access  Public
const getFeaturedShops = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const shops = await Shop.getFeaturedShops(Number(limit));

    res.json({
      shops,
      count: shops.length
    });
  } catch (error) {
    console.error('Get featured shops error:', error);
    res.status(500).json({
      message: 'Server error while fetching featured shops'
    });
  }
};

// @desc    Create new shop
// @route   POST /api/shops
// @access  Private (Seller)
const createShop = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ ownerId: req.user.id });
    if (existingShop) {
      return res.status(400).json({
        message: 'You already have a shop'
      });
    }

    // Check if user role is seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({
        message: 'Only sellers can create shops'
      });
    }

    const shopData = {
      ...req.body,
      ownerId: req.user.id
    };

    const shop = new Shop(shopData);
    await shop.save();

    // Populate the created shop
    const populatedShop = await Shop.findById(shop._id)
      .populate('ownerId', 'firstName lastName avatar');

    res.status(201).json({
      message: 'Shop created successfully',
      shop: populatedShop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({
      message: 'Server error while creating shop'
    });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (Owner/Admin)
const updateShop = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

    // Check ownership or admin role
    if (shop.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this shop'
      });
    }

    // Update shop
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        shop[key] = req.body[key];
      }
    });

    await shop.save();

    // Populate the updated shop
    const updatedShop = await Shop.findById(shop._id)
      .populate('ownerId', 'firstName lastName avatar');

    res.json({
      message: 'Shop updated successfully',
      shop: updatedShop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating shop'
    });
  }
};

// @desc    Get my shop
// @route   GET /api/shops/my-shop
// @access  Private (Seller)
const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user.id })
      .populate('ownerId', 'firstName lastName avatar email');

    if (!shop) {
      return res.status(404).json({
        message: 'You don\'t have a shop yet'
      });
    }

    // Get shop statistics
    const products = await Product.find({ shopId: shop._id });
    const activeProducts = products.filter(p => p.isActive).length;

    res.json({
      shop,
      stats: {
        totalProducts: products.length,
        activeProducts,
        inactiveProducts: products.length - activeProducts
      }
    });
  } catch (error) {
    console.error('Get my shop error:', error);
    res.status(500).json({
      message: 'Server error while fetching your shop'
    });
  }
};

// @desc    Get shop products
// @route   GET /api/shops/:id/products
// @access  Public
const getShopProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Check if shop exists
    const shop = await Shop.findById(id);
    if (!shop || !shop.isActive) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

    // Build filter
    const filter = { shopId: id, isActive: true };
    if (category) filter.category = category;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('ownerId', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      shop: {
        id: shop._id,
        name: shop.name,
        logo: shop.logo
      },
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get shop products error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching shop products'
    });
  }
};

// @desc    Update shop stats
// @route   PUT /api/shops/:id/stats
// @access  Private (Owner/Admin)
const updateShopStats = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

    // Check ownership or admin role
    if (shop.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this shop stats'
      });
    }

    await shop.updateStats();

    res.json({
      message: 'Shop stats updated successfully',
      stats: shop.stats
    });
  } catch (error) {
    console.error('Update shop stats error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating shop stats'
    });
  }
};

module.exports = {
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
};
