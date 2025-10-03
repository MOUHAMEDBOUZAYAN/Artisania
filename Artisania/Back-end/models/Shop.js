const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    maxlength: [100, 'Shop name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Shop description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  logo: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required'],
    unique: true // Each user can have only one shop
  },
  contact: {
    email: {
      type: String,
      required: false, // جعل الحقل اختيارياً
      validate: {
        validator: function(v) {
          // إذا كان فارغاً أو undefined، فهو صحيح
          if (!v || v === '') return true;
          // إذا كان له قيمة، يجب أن يكون بريد إلكتروني صحيح
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email'
      }
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'Morocco'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  businessInfo: {
    businessType: {
      type: String,
      enum: ['individual', 'company'],
      default: 'individual'
    },
    taxId: String,
    registrationNumber: String,
    foundedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    }
  },
  categories: [{
    type: String,
    enum: [
      'ceramics', 'textiles', 'jewelry', 'painting', 'woodwork',
      'metalwork', 'glasswork', 'leatherwork', 'pottery', 'sculpture', 'other'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  stats: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  settings: {
    autoAcceptOrders: {
      type: Boolean,
      default: false
    },
    allowMessages: {
      type: Boolean,
      default: true
    },
    showContactInfo: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
shopSchema.index({ name: 'text', description: 'text' });
shopSchema.index({ ownerId: 1 });
shopSchema.index({ isActive: 1, isVerified: 1 });
shopSchema.index({ categories: 1 });
shopSchema.index({ 'address.city': 1 });

// Virtual for full address
shopSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city} ${this.address.postalCode}, ${this.address.country}`;
});

// Virtual for shop URL slug
shopSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
});

// Ensure virtual fields are serialized
shopSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

// Pre-save middleware to update stats
shopSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Initialize stats for new shop
    this.stats = {
      totalProducts: 0,
      totalSales: 0,
      totalRevenue: 0
    };
  }
  next();
});

// Static method to get featured shops
shopSchema.statics.getFeaturedShops = function(limit = 10) {
  return this.find({ 
    isActive: true, 
    isVerified: true, 
    isFeatured: true 
  })
  .populate('ownerId', 'firstName lastName avatar')
  .limit(limit)
  .sort({ 'rating.average': -1, createdAt: -1 });
};

// Static method to get shops by category
shopSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    categories: category,
    isActive: true,
    isVerified: true
  })
  .populate('ownerId', 'firstName lastName avatar')
  .limit(limit)
  .sort({ 'rating.average': -1 });
};

// Static method to search shops
shopSchema.statics.searchShops = function(query, limit = 10) {
  return this.find({
    $text: { $search: query },
    isActive: true,
    isVerified: true
  })
  .populate('ownerId', 'firstName lastName avatar')
  .limit(limit)
  .sort({ score: { $meta: 'textScore' } });
};

// Instance method to update shop stats
shopSchema.methods.updateStats = async function() {
  const Product = require('./Product');
  const Order = require('./Order');
  
  const totalProducts = await Product.countDocuments({ 
    shopId: this._id, 
    isActive: true 
  });
  
  const orders = await Order.find({ shopId: this._id, status: 'delivered' });
  const totalSales = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  this.stats = {
    totalProducts,
    totalSales,
    totalRevenue
  };
  
  await this.save();
};

module.exports = mongoose.model('Shop', shopSchema);
