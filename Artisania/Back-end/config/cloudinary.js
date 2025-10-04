require('dotenv').config({ path: './.env' });

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

process.env.CLOUDINARY_CLOUD_NAME = 'dkbltpmer';
process.env.CLOUDINARY_API_KEY = '687977978336645';
process.env.CLOUDINARY_API_SECRET = '_pmTWBzPetcy4YCXo1nAwFJ3g3s';

console.log('🔧 Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'undefined',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'undefined'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.ping()
  .then(result => console.log('✅ Cloudinary connected successfully:', result))
  .catch(error => console.error('❌ Cloudinary connection failed:', error));

const shopStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'artisania/shops',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' }
    ]
  }
});

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'artisania/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' }
    ]
  }
});

const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'artisania/shops/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' }
    ]
  }
});

const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'artisania/shops/banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 400, crop: 'fill' }
    ]
  }
});

const uploadShopImages = multer({ storage: shopStorage });
const uploadProductImages = multer({ storage: productStorage });
const uploadLogo = multer({ storage: logoStorage });
const uploadBanner = multer({ storage: bannerStorage });

module.exports = {
  cloudinary,
  uploadShopImages,
  uploadProductImages,
  uploadLogo,
  uploadBanner
};
