const { validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const Product = require('../models/Product');

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

    const filter = { isActive: true };
    
    if (category) filter.categories = category;
    if (featured === 'true') filter.isFeatured = true;
    if (verified === 'true') filter.isVerified = true;
    
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

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

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('ownerId', 'firstName lastName avatar email phone');

    if (!shop || !shop.isActive) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

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

const createShop = async (req, res) => {
  try {
    console.log('🏪 createShop called with data:', req.body);
    console.log('👤 User:', req.user.email, 'Role:', req.user.role);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

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

    // تحويل البيانات لتتناسب مع نموذج Shop
    const { name, description, address, phone, email, categories, isOpen } = req.body;
    
    const shopData = {
      name,
      description,
      contact: {
        phone,
        email: email || ''
      },
      address: {
        street: address.street,
        city: address.city,
        country: address.country || 'Morocco',
        postalCode: address.postalCode || '00000' // إضافة postalCode افتراضي
      },
      categories: categories || [],
      ownerId: req.user.id,
      isOpen: isOpen !== undefined ? isOpen : true
    };

    console.log('💾 Creating shop with data:', shopData);
    const shop = new Shop(shopData);
    await shop.save();
    console.log('✅ Shop created successfully:', shop._id);

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

const updateShop = async (req, res) => {
  try {
    console.log('🔄 updateShop called with ID:', req.params.id)
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2))
    console.log('👤 User:', req.user?.email, 'Role:', req.user?.role)
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array())
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    console.log('🔍 Finding shop with ID:', req.params.id)
    const shop = await Shop.findById(req.params.id);
    console.log('🏪 Shop found:', shop ? 'Yes' : 'No')

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
    console.log('🔄 Updating shop fields...')
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        console.log(`📝 Updating field: ${key} = ${JSON.stringify(req.body[key])}`)
        if (key === 'address') {
          // Handle nested address object - preserve existing coordinates
          const newAddress = { ...req.body[key] };
          
          // Only preserve coordinates if they exist and new ones aren't provided
          if (shop.address && shop.address.coordinates && !newAddress.coordinates) {
            newAddress.coordinates = shop.address.coordinates;
          }
          
          shop.address = { 
            ...shop.address, 
            ...newAddress
          };
          console.log('🏠 Updated address:', shop.address)
        } else if (key === 'contact') {
          // Handle nested contact object
          shop.contact = { ...shop.contact, ...req.body[key] };
          console.log('📞 Updated contact:', shop.contact)
        } else {
          shop[key] = req.body[key];
          console.log(`✅ Updated ${key}:`, shop[key])
        }
      }
    });

    console.log('💾 Saving shop to database...')
    await shop.save();
    console.log('✅ Shop saved successfully')

    // Populate the updated shop
    const updatedShop = await Shop.findById(shop._id)
      .populate('ownerId', 'firstName lastName avatar');

    res.json({
      message: 'Shop updated successfully',
      shop: updatedShop
    });
  } catch (error) {
    console.error('❌ Update shop error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating shop',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getMyShop = async (req, res) => {
  try {
    console.log('🔍 getMyShop called for user:', req.user.id);
    const shop = await Shop.findOne({ ownerId: req.user.id })
      .populate('ownerId', 'firstName lastName avatar email');

    console.log('🏪 Shop found:', !!shop);
    
    if (!shop) {
      console.log('❌ No shop found for user:', req.user.id);
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

const getShopProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const shop = await Shop.findById(id);
    if (!shop || !shop.isActive) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

    const filter = { shopId: id, isActive: true };
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);

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
