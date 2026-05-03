const express = require('express');
const router = express.Router();
const { uploadImage, uploadVideo } = require('../config/cloudinary');
const {
  uploadImages,
  uploadSingleImage,
  uploadVideos,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/image', protect, uploadImage.single('image'), uploadSingleImage);
router.post('/images', protect, uploadImage.array('images', 20), uploadImages);
router.post('/videos', protect, uploadVideo.array('videos', 5), uploadVideos);

module.exports = router;
