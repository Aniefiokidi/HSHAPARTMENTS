require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✨ Her Serene Highness API`);
      console.log(`   Server: http://localhost:${PORT}`);
      console.log(`   Env:    ${process.env.NODE_ENV || 'development'}\n`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
