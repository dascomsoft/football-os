const mongoose = require('mongoose');
const env = require('../../config/env');
const User = require('../../models/User.model');
const Academy = require('../../models/Academy.model');
const Club = require('../../models/Club.model');
const Coach = require('../../models/Coach.model');
const Contact = require('../../models/Contact.model');
const { findPrimaryAdmin } = require('../../services/contact-sync.service');

(async () => {
  await mongoose.connect(env.mongoUri);

  const admin = await findPrimaryAdmin();
  if (!admin) {
    console.error('Aucun ADMIN approuve trouve');
    process.exit(1);
  }
  console.log('Admin cible :', admin.email);

  const users = await User.find({
    role: { $in: ['ACADEMY', 'CLUB', 'COACH'] },
    status: 'APPROVED',
  });

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    let profile = null;
    let country = '';
    let city = '';
    let organizationName = '';

    if (user.role === 'ACADEMY') {
      profile = await Academy.findOne({ userId: user._id });
      if (profile) {
        country = profile.country || '';
        city = profile.city || '';
        organizationName = profile.name;
      }
    } else if (user.role === 'CLUB') {
      profile = await Club.findOne({ userId: user._id });
      if (profile) {
        country = profile.country || '';
        city = profile.city || '';
        organizationName = profile.name;
      }
    } else if (user.role === 'COACH') {
      profile = await Coach.findOne({ userId: user._id });
      if (profile) {
        country = profile.countryOfResidence || '';
        city = profile.city || '';
        organizationName = `${profile.firstName} ${profile.lastName}`.trim();
      }
    }

    if (!profile) {
      console.log('Profil introuvable pour', user.email, '- skip');
      skipped += 1;
      continue;
    }

    const existing = await Contact.findOne({
      ownerId: admin._id,
      userId: user._id,
      deletedAt: null,
    });
    if (existing) {
      console.log('Contact deja existant pour', user.email, '- skip');
      skipped += 1;
      continue;
    }

    await Contact.create({
      ownerId: admin._id,
      type: user.role,
      organizationName: organizationName || 'Sans nom',
      userId: user._id,
      organizationId: profile._id,
      organizationType: user.role,
      country,
      city,
      phone: user.phone || '',
      email: user.email || '',
      relationshipStatus: 'PROSPECT',
      source: 'PLATFORM_SIGNUP',
      autoCreated: true,
    });
    console.log('Contact cree pour', user.email);
    created += 1;
  }

  console.log(`Total crees: ${created}, ignores: ${skipped}`);
  await mongoose.connection.close();
  process.exit(0);
})();