const mongoose = require('mongoose');
const env = require('../config/env');
const User = require('../models/User.model');

(async () => {
  await mongoose.connect(env.mongoUri);
  const users = await User.find({}, 'email role status').lean();
  console.log('Total users:', users.length);
  users.forEach((u) => {
    console.log('- ' + u.email + ' | ' + u.role + ' | ' + u.status);
  });
  await mongoose.connection.close();
})();