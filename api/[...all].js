module.exports = async (req, res) => {
  try {
    const app = require('../server/app');
    const connectDB = require('../server/config/db');

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Serverless boot error:', error);
    return res.status(500).json({
      success: false,
      message: 'Serverless function startup failed',
      error: error.message,
    });
  }
};