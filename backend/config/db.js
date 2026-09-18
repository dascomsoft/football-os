const mongoose = require('mongoose');
const env = require('./env');

mongoose.set('strictQuery', true);

async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    const { host, name } = mongoose.connection;
    console.log(`[db] MongoDB connected - host=${host} db=${name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[db] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[db] MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    console.error('[db] Initial connection failed:', error.message);
    throw error;
  }
}

async function disconnectDatabase() {
  await mongoose.connection.close();
  console.log('[db] MongoDB connection closed');
}

module.exports = { connectDatabase, disconnectDatabase };