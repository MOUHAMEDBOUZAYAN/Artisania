const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      shopId,
      featured
    } = req.query;

    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (shopId) filter.shopId = shopId;
    if (featured === 'true') filter.isFeatured = true;
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (search) sort.score = { $meta: 'textScore' };

    const products = await Product.find(filter)
      .populate('shopId', 'name logo')
      .populate('ownerId', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
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
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Server error while fetching products'
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shopId', 'name logo description contact address')
      .populate('ownerId', 'firstName lastName avatar');

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching product'
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const products = await Product.getByCategory(category, Number(limit));

    res.json({
      category,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      message: 'Server error while fetching products by category'
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const products = await Product.searchProducts(query, Number(limit));

    res.json({
      query,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      message: 'Server error while searching products'
    });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log('📦 createProduct called with data:', req.body);
    console.log('👤 User:', req.user.email, 'Role:', req.user.role);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const shop = await Shop.findOne({ ownerId: req.user.id });
    if (!shop) {
      return res.status(400).json({
        message: 'You must create a shop first before adding products'
      });
    }

    const productData = {
      ...req.body,
      ownerId: req.user.id,
      shopId: shop._id
    };

    const product = new Product(productData);
    await product.save();

    // Update shop stats
    await shop.updateStats();

    // Populate the created product
    const populatedProduct = await Product.findById(product._id)
      .populate('shopId', 'name logo')
      .populate('ownerId', 'firstName lastName');

    res.status(201).json({
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: 'Server error while creating product'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Check ownership or admin role
    if (product.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this product'
      });
    }

    // Update product
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    await product.save();

    // Populate the updated product
    const updatedProduct = await Product.findById(product._id)
      .populate('shopId', 'name logo')
      .populate('ownerId', 'firstName lastName');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating product'
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Check ownership or admin role
    if (product.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to delete this product'
      });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    // Update shop stats
    const shop = await Shop.findById(product.shopId);
    if (shop) {
      await shop.updateStats();
    }

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Product not found'
      });
    }
    res.status(500).json({
      message: 'Server error while deleting product'
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;

    const filter = { ownerId: req.user.id };
    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate('shopId', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
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
    console.error('Get my products error:', error);
    res.status(500).json({
      message: 'Server error while fetching your products'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
};
