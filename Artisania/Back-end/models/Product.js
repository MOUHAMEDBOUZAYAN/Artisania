const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'ceramics',      // سيراميك
      'textiles',      // نسيج
      'jewelry',       // مجوهرات
      'painting',      // رسم
      'woodwork',      // نجارة
      'metalwork',     // حدادة
      'glasswork',     // زجاج
      'leatherwork',   // جلد
      'pottery',       // فخار
      'sculpture',     // نحت
      'other'          // أخرى
    ]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'Shop ID is required']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  specifications: {
    materials: [String],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'm', 'inch'],
        default: 'cm'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['g', 'kg', 'lb'],
        default: 'g'
      }
    },
    colors: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ ownerId: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.stock > 0;
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0].url : null;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

// Pre-save middleware to update tags from name and description
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isModified('description')) {
    const text = `${this.name} ${this.description}`.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    this.tags = [...new Set(words.filter(word => word.length > 2))];
  }
  next();
});

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    category, 
    isActive: true 
  })
  .populate('shopId', 'name logo')
  .populate('ownerId', 'firstName lastName')
  .limit(limit)
  .sort({ createdAt: -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(query, limit = 10) {
  return this.find({
    $text: { $search: query },
    isActive: true
  })
  .populate('shopId', 'name logo')
  .populate('ownerId', 'firstName lastName')
  .limit(limit)
  .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema);
