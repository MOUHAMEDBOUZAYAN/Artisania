const express = require('express');
const { uploadLogo, uploadBanner, uploadProductImages } = require('../config/cloudinary');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload/shop/logo
// @desc    Upload shop logo
// @access  Private (Seller)
router.post('/shop/logo', verifyToken, requireRole('seller', 'admin'), (req, res) => {
  uploadLogo.single('logo')(req, res, (err) => {
    if (err) {
      console.error('📸 Logo upload multer error:', err);
      return res.status(500).json({
        message: 'Error uploading logo',
        error: err.message
      });
    }

    try {
      console.log('📸 Logo upload request:', req.file);
      if (!req.file) {
        return res.status(400).json({
          message: 'No image uploaded'
        });
      }

      res.json({
        message: 'Logo uploaded successfully',
        imageUrl: req.file.path,
        publicId: req.file.filename
      });
    } catch (error) {
      console.error('Logo upload error:', error);
      res.status(500).json({
        message: 'Error uploading logo',
        error: error.message
      });
    }
  });
});

// @route   POST /api/upload/shop/banner
// @desc    Upload shop banner
// @access  Private (Seller)
router.post('/shop/banner', verifyToken, requireRole('seller', 'admin'), (req, res) => {
  uploadBanner.single('banner')(req, res, (err) => {
    if (err) {
      console.error('📸 Banner upload multer error:', err);
      return res.status(500).json({
        message: 'Error uploading banner',
        error: err.message
      });
    }

    try {
      console.log('📸 Banner upload request:', req.file);
      if (!req.file) {
        return res.status(400).json({
          message: 'No image uploaded'
        });
      }

      res.json({
        message: 'Banner uploaded successfully',
        imageUrl: req.file.path,
        publicId: req.file.filename
      });
    } catch (error) {
      console.error('Banner upload error:', error);
      res.status(500).json({
        message: 'Error uploading banner',
        error: error.message
      });
    }
  });
});

// @route   POST /api/upload/product/images
// @desc    Upload single product image
// @access  Private (Seller)
router.post('/product/images', verifyToken, requireRole('seller', 'admin'), (req, res) => {
  uploadProductImages.single('images')(req, res, (err) => {
    if (err) {
      console.error('📸 Product image upload multer error:', err);
      return res.status(500).json({
        message: 'Error uploading product image',
        error: err.message
      });
    }

    try {
      console.log('📸 Product image upload request:', req.file);
      if (!req.file) {
        return res.status(400).json({
          message: 'No image uploaded'
        });
      }

      res.json({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path,
        publicId: req.file.filename
      });
    } catch (error) {
      console.error('Product image upload error:', error);
      res.status(500).json({
        message: 'Error uploading product image',
        error: error.message
      });
    }
  });
});

module.exports = router;
