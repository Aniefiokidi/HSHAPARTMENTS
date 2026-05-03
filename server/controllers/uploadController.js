// Handle Cloudinary upload results from multer-storage-cloudinary
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const urls = req.files.map((file) => file.path);
    res.json({ success: true, data: urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ success: true, data: req.file.path });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadVideos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    // multer-storage-cloudinary v4 + cloudinary v1 may return /image/upload/ for videos.
    // Normalise to /video/upload/ so browsers can play them.
    const urls = req.files.map((file) =>
      (file.path || '').replace('/image/upload/', '/video/upload/')
    );
    res.json({ success: true, data: urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadImages, uploadSingleImage, uploadVideos };
