const mongoose = require('mongoose');
const env = require('../../config/env');
const User = require('../../models/User.model');
const Club = require('../../models/Club.model');

(async () => {
  await mongoose.connect(env.mongoUri);
  const email = process.argv[2] || 'clubtest@demo.local';
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User introuvable');
    process.exit(1);
  }
  await User.findByIdAndUpdate(user._id, { status: 'APPROVED' });
  await Club.findOneAndUpdate(
    { userId: user._id },
    { status: 'APPROVED', statusReason: '' }
  );
  console.log('Club approuve:', email);
  await mongoose.connection.close();
})();