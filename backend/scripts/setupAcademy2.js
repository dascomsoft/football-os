const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User.model');
const Academy = require('../models/Academy.model');

(async () => {
  await mongoose.connect(env.mongoUri);

  const user = await User.findOne({ email: 'academy2@demo.local' });
  if (!user) {
    console.error('User academy2 introuvable');
    process.exit(1);
  }

  let academy = await Academy.findOne({ userId: user._id });
  if (!academy) {
    academy = await Academy.create({
      userId: user._id,
      name: 'DEMO Academy Two',
      country: 'Cameroon',
      city: 'Yaounde',
      foundedYear: 2015,
      status: 'APPROVED',
    });
    console.log('Academy2 creee:', academy._id.toString());
  } else {
    console.log('Academy2 existante:', academy._id.toString());
  }

  await User.findByIdAndUpdate(user._id, { status: 'APPROVED' });
  console.log('User academy2 passe a APPROVED');

  await mongoose.connection.close();
})();