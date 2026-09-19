const mongoose = require('mongoose');
const env = require('../../config/env');
const User = require('../../models/User.model');
const Academy = require('../../models/Academy.model');
const { hashPassword } = require('../../services/password.service');

(async () => {
  const email = process.argv[2] || 'pending1@demo.local';
  const name = process.argv[3] || 'DEMO Pending Academy';

  await mongoose.connect(env.mongoUri);

  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await hashPassword('Password123');
    user = await User.create({
      email,
      passwordHash,
      firstName: 'Pending',
      lastName: 'Academy',
      role: 'ACADEMY',
      status: 'PENDING',
    });
    console.log('User PENDING cree:', user._id.toString());
  } else {
    console.log('User deja existant:', user._id.toString());
  }

  let academy = await Academy.findOne({ userId: user._id });
  if (!academy) {
    academy = await Academy.create({
      userId: user._id,
      name,
      country: 'Senegal',
      city: 'Dakar',
      foundedYear: 2018,
      status: 'PENDING',
    });
    console.log('Academy PENDING creee:', academy._id.toString());
  } else {
    academy.status = 'PENDING';
    academy.statusReason = '';
    await academy.save();
    console.log('Academy remise en PENDING:', academy._id.toString());
  }

  await mongoose.connection.close();
})();