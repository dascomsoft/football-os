const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User.model');
const Academy = require('../models/Academy.model');

(async () => {
  await mongoose.connect(env.mongoUri);

  const user = await User.findOne({ email: 'academy1@demo.local' });
  if (!user) {
    console.error('User academy1 introuvable');
    process.exit(1);
  }

  let academy = await Academy.findOne({ userId: user._id });
  if (!academy) {
    academy = await Academy.create({
      userId: user._id,
      name: 'DEMO Academy One',
      country: 'Cameroon',
      city: 'Douala',
      foundedYear: 2010,
      status: 'APPROVED',
    });
    console.log('Academy creee:', academy._id.toString());
  } else {
    console.log('Academy existante:', academy._id.toString());
  }

  await User.findByIdAndUpdate(user._id, { status: 'APPROVED' });
  console.log('User academy1 passe a APPROVED');

  await mongoose.connection.close();
})();