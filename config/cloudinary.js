const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage with optimization
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bimpzy-hair-world',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
    ]
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper function to get optimized URL
function getOptimizedUrl(publicId, width = 400, height = 400) {
  if (!publicId) return null;
  return cloudinary.url(publicId, {
    width: width,
    height: height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
    loading: 'lazy'
  });
}

module.exports = { cloudinary, upload, getOptimizedUrl };