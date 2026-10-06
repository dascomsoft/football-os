const Contact = require('../models/Contact.model');
const User = require('../models/User.model');

async function findPrimaryAdmin() {
  const admin = await User.findOne({
    role: 'ADMIN',
    status: 'APPROVED',
  }).sort({ createdAt: 1 });

  return admin;
}

async function syncContactFromRegistration({ user, profile, profileType, accountPhone }) {
  if (!['ACADEMY', 'CLUB', 'COACH'].includes(profileType)) {
    return null;
  }

  const admin = await findPrimaryAdmin();
  if (!admin) {
    console.warn(
      '[contact-sync] No approved ADMIN found. Skipping Contact creation for',
      user.email
    );
    return null;
  }

  // Verifie si un contact existe deja pour cet utilisateur chez cet admin
  const existing = await Contact.findOne({
    ownerId: admin._id,
    userId: user._id,
    deletedAt: null,
  });
  if (existing) {
    return existing;
  }

  const organizationName =
    profileType === 'COACH'
      ? `${profile.firstName || user.firstName} ${profile.lastName || user.lastName}`.trim()
      : profile.name || 'Sans nom';

  const country = profile.country || profile.countryOfResidence || '';
  const city = profile.city || '';

  const contact = await Contact.create({
    ownerId: admin._id,
    type: profileType,
    organizationName,
    userId: user._id,
    organizationId: profile._id,
    organizationType: profileType,
    country,
    city,
    contactName: '',
    contactRole: '',
    phone: accountPhone || '',
    whatsapp: '',
    email: user.email || '',
    relationshipStatus: 'PROSPECT',
    tags: [],
    privateNotes: '',
    source: 'PLATFORM_SIGNUP',
    autoCreated: true,
  });

  return contact;
}

module.exports = { syncContactFromRegistration, findPrimaryAdmin };