const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  productSnapshot: {
    name: String,
    image: String,
    shopName: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'Shop ID is required']
  },
  items: [orderItemSchema],
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Morocco'
    },
    phone: {
      type: String,
      required: true
    }
  },
  billingAddress: {
    type: mongoose.Schema.Types.Mixed,
    default: null // If null, same as shipping address
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: [
      'pending',        // في الانتظار
      'confirmed',      // مؤكد
      'preparing',      // قيد التحضير
      'shipped',        // تم الشحن
      'delivered',      // تم التسليم
      'cancelled',      // ملغي
      'refunded'        // مسترد
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: [
      'pending',        // في الانتظار
      'paid',           // مدفوع
      'failed',         // فشل
      'refunded'        // مسترد
    ],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'credit_card', 'bank_transfer', 'wallet'],
    default: 'cash_on_delivery'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    refundDate: Date,
    refundAmount: Number
  },
  shippingDetails: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippingNotes: String
  },
  notes: {
    customerNotes: String,
    sellerNotes: String,
    adminNotes: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ shopId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Generate random number
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.orderNumber = `ART${year}${month}${day}${random}`;
  }
  
  // Add to timeline
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  
  next();
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  return {
    orderNumber: this.orderNumber,
    totalItems: this.totalItems,
    total: this.pricing.total,
    status: this.status,
    createdAt: this.createdAt
  };
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId, limit = 10, skip = 0) {
  return this.find({ userId })
    .populate('shopId', 'name logo')
    .populate('items.productId', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get orders by shop
orderSchema.statics.getByShop = function(shopId, limit = 10, skip = 0) {
  return this.find({ shopId })
    .populate('userId', 'firstName lastName email')
    .populate('items.productId', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get order statistics
orderSchema.statics.getStats = function(shopId = null, userId = null) {
  const match = {};
  if (shopId) match.shopId = shopId;
  if (userId) match.userId = userId;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    }
  ]);
};

// Instance method to update order status
orderSchema.methods.updateStatus = async function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  await this.save();
  
  // Update shop stats if order is delivered
  if (newStatus === 'delivered' && this.paymentStatus === 'paid') {
    const Shop = require('./Shop');
    const shop = await Shop.findById(this.shopId);
    if (shop) {
      await shop.updateStats();
    }
  }
};

module.exports = mongoose.model('Order', orderSchema);
