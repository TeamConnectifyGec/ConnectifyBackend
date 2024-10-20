const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up dynamic Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folderName = req.body.folder || 'general';  // Dynamically set folder based on request

    return {
      folder: folderName,  // Upload to the specified folder
      allowed_formats: ['jpeg', 'png', 'jpg'],
    };
  },
});


const upload = multer({ storage: storage });

exports.cloudinary = cloudinary;
exports.upload = upload;