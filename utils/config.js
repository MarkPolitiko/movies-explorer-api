// const MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb';

// module.exports = MONGO_URL;

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  MONGODB_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb',
};
