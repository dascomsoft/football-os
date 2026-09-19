const mongoose = require('mongoose');
const env = require('../../config/env');
const User = require('../../models/User.model');
const Academy = require('../../models/Academy.model');
const Club = require('../../models/Club.model');
const Coach = require('../../models/Coach.model');

(async () => {
  await mongoose.connect(env.mongoUri);

  const users = await User.find({
    role: { $in: ['ACADEMY', 'CLUB', 'COACH'] },
  }).lean();

  let orphans = 0;
  for (const user of users) {
    let profile = null;
    if (user.role === 'ACADEMY') profile = await Academy.findOne({ userId: user._id });
    if (user.role === 'CLUB') profile = await Club.findOne({ userId: user._id });
    if (user.role === 'COACH') profile = await Coach.findOne({ userId: user._id });

    if (!profile) {
      console.log('ORPHELIN:', user.email, user.role);
      orphans += 1;
    }
  }

  console.log(`Total users ACADEMY/CLUB/COACH: ${users.length}`);
  console.log(`Orphelins: ${orphans}`);

  await mongoose.connection.close();
})();