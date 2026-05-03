const mongoose = require('mongoose');

let connectPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectPromise) {
    return connectPromise;
  }

  try {
    connectPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'hsh-apartments',
      serverSelectionTimeoutMS: 10000,
    });

    const conn = await connectPromise;
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    connectPromise = null;
    return conn;
  } catch (error) {
    connectPromise = null;
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
