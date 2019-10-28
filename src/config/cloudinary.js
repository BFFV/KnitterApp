require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.uploads = (file) => cloudinary.uploader.upload(
  file, { resource_type: 'auto' },
);

exports.deletes = (file) => cloudinary.uploader.destroy(file);
