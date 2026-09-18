const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User.model');
const { hashPassword } = require('../services/password.service');

async function run() {
  const email = (process.env.SEED_ADMIN_EMAIL || '').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || '';
  const firstName = process.env.SEED_ADMIN_FIRSTNAME || 'Demo';
  const lastName = process.env.SEED_ADMIN_LASTNAME || 'Admin';

  if (!email || !password) {
    console.error('[seed] SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required');
    process.exit(1);
  }

  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('[seed] MongoDB connected');

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`[seed] Admin already exists: ${email} - no action`);
      await mongoose.connection.close();
      process.exit(0);
    }

    const passwordHash = await hashPassword(password);

    const admin = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'ADMIN',
      status: 'APPROVED',
      phone: '',
    });

    console.log(`[seed] DEMO DATA - Admin created: ${admin.email} (id=${admin._id})`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[seed] Failed:', error.message);
    process.exit(1);
  }
}

run();