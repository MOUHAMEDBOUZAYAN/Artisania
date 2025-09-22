const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// @desc    Get all orders with filtering and pagination
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      shopId,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (shopId) filter.shopId = shopId;
    if (userId) filter.userId = userId;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('shopId', 'name logo')
      .populate('items.productId', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalOrders: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner/Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone address')
      .populate('shopId', 'name logo contact address')
      .populate('items.productId', 'name images specifications');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    const canAccess = req.user.role === 'admin' || 
                     order.userId._id.toString() === req.user.id ||
                     order.shopId.ownerId.toString() === req.user.id;

    if (!canAccess) {
      return res.status(403).json({
        message: 'Not authorized to view this order'
      });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    res.status(500).json({
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .populate('shopId', 'name logo')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalOrders: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      message: 'Server error while fetching your orders'
    });
  }
};

// @desc    Get shop's orders
// @route   GET /api/orders/shop-orders
// @access  Private (Seller)
const getShopOrders = async (req, res) => {
  try {
    // Check if user has a shop
    const shop = await Shop.findOne({ ownerId: req.user.id });
    if (!shop) {
      return res.status(400).json({
        message: 'You must have a shop to view shop orders'
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    const filter = { shopId: shop._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalOrders: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({
      message: 'Server error while fetching shop orders'
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, shippingAddress, paymentMethod, notes } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          message: `Product ${item.productId} not found or inactive`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        productSnapshot: {
          name: product.name,
          image: product.images[0]?.url || '',
          shopName: '' // Will be filled later
        }
      });
    }

    // Get shop info for the first item (assuming all items are from same shop)
    const firstProduct = await Product.findById(items[0].productId).populate('shopId');
    if (!firstProduct) {
      return res.status(400).json({
        message: 'Invalid product'
      });
    }

    // Update product snapshots with shop name
    orderItems.forEach(item => {
      item.productSnapshot.shopName = firstProduct.shopId.name;
    });

    // Calculate shipping and tax
    const shippingCost = 50; // Fixed shipping cost for now
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      userId: req.user.id,
      shopId: firstProduct.shopId._id,
      items: orderItems,
      shippingAddress,
      pricing: {
        subtotal,
        shippingCost,
        tax,
        total
      },
      paymentMethod,
      notes: {
        customerNotes: notes?.customerNotes || ''
      }
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate the created order
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'firstName lastName email')
      .populate('shopId', 'name logo')
      .populate('items.productId', 'name images');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      message: 'Server error while creating order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Shop Owner/Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check authorization
    const shop = await Shop.findById(order.shopId);
    const canUpdate = req.user.role === 'admin' || 
                     shop.ownerId.toString() === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        message: 'Not authorized to update this order'
      });
    }

    // Update order status
    await order.updateStatus(status, note, req.user.id);

    // Populate the updated order
    const updatedOrder = await Order.findById(order._id)
      .populate('userId', 'firstName lastName email')
      .populate('shopId', 'name logo');

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    res.status(500).json({
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Customer/Admin)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Check authorization
    const canCancel = req.user.role === 'admin' || 
                     order.userId.toString() === req.user.id;

    if (!canCancel) {
      return res.status(403).json({
        message: 'Not authorized to cancel this order'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    // Update order status
    await order.updateStatus('cancelled', 'Order cancelled by customer', req.user.id);

    res.json({
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        message: 'Order not found'
      });
    }
    res.status(500).json({
      message: 'Server error while cancelling order'
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Admin/Shop Owner)
const getOrderStats = async (req, res) => {
  try {
    let shopId = null;
    
    // If user is seller, get their shop
    if (req.user.role === 'seller') {
      const shop = await Shop.findOne({ ownerId: req.user.id });
      if (!shop) {
        return res.status(400).json({
          message: 'You must have a shop to view order statistics'
        });
      }
      shopId = shop._id;
    }

    const stats = await Order.getStats(shopId);

    res.json({
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        averageOrderValue: 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching order statistics'
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getMyOrders,
  getShopOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
};
