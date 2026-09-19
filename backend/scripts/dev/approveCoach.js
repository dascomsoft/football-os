const mongoose = require('mongoose');
const env = require('../../config/env');
const User = require('../../models/User.model');
const Coach = require('../../models/Coach.model');

(async () => {
  await mongoose.connect(env.mongoUri);
  const email = process.argv[2] || 'coach1@demo.local';

  const user = await User.findOne({ email });
  if (!user) { console.error('User introuvable'); process.exit(1); }

  await User.findByIdAndUpdate(user._id, { status: 'APPROVED' });
  await Coach.findOneAndUpdate({ userId: user._id }, { status: 'APPROVED' });

  console.log('Coach approuve:', email);
  await mongoose.connection.close();
})();