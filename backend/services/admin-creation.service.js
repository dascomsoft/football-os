const crypto = require('crypto');
const User = require('../models/User.model');
const Academy = require('../models/Academy.model');
const Club = require('../models/Club.model');
const Coach = require('../models/Coach.model');
const Player = require('../models/Player.model');
const Opportunity = require('../models/Opportunity.model');
const { hashPassword } = require('./password.service');
const ApiError = require('../utils/ApiError');

function generateTemporaryPassword() {
  return crypto
    .randomBytes(12)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 16);
}

async function assertEmailFree(email) {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }
}

async function createOrganizationUser({ email, firstName, lastName, phone, role }) {
  await assertEmailFree(email);

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);

  const user = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    firstName,
    lastName,
    phone: phone || '',
    role,
    status: 'APPROVED',
  });

  return { user, temporaryPassword };
}

async function createClubAsAdmin(payload) {
  const {
    email,
    firstName,
    lastName,
    phone,
    name,
    country,
    city,
    competition,
    foundedYear,
    description,
  } = payload;

  const { user, temporaryPassword } = await createOrganizationUser({
    email,
    firstName,
    lastName,
    phone,
    role: 'CLUB',
  });

  try {
    const club = await Club.create({
      userId: user._id,
      name,
      country,
      city: city || '',
      competition: competition || '',
      foundedYear: foundedYear || null,
      description: description || '',
      status: 'APPROVED',
    });
    return { user, profile: club, temporaryPassword };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
}

async function createAcademyAsAdmin(payload) {
  const {
    email,
    firstName,
    lastName,
    phone,
    name,
    country,
    city,
    foundedYear,
    description,
  } = payload;

  const { user, temporaryPassword } = await createOrganizationUser({
    email,
    firstName,
    lastName,
    phone,
    role: 'ACADEMY',
  });

  try {
    const academy = await Academy.create({
      userId: user._id,
      name,
      country,
      city: city || '',
      foundedYear: foundedYear || null,
      description: description || '',
      status: 'APPROVED',
    });
    return { user, profile: academy, temporaryPassword };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
}

async function createCoachAsAdmin(payload) {
  const {
    email,
    phone,
    firstName,
    lastName,
    nationality,
    countryOfResidence,
    city,
    primaryRole,
    yearsOfExperience,
    licenses,
  } = payload;

  const { user, temporaryPassword } = await createOrganizationUser({
    email,
    firstName,
    lastName,
    phone,
    role: 'COACH',
  });

  try {
    const coach = await Coach.create({
      userId: user._id,
      firstName,
      lastName,
      nationality: nationality || '',
      countryOfResidence: countryOfResidence || '',
      city: city || '',
      primaryRole,
      yearsOfExperience: yearsOfExperience || 0,
      licenses: Array.isArray(licenses) ? licenses : [],
      status: 'APPROVED',
    });
    return { user, profile: coach, temporaryPassword };
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
}

async function createPlayerAsAdmin(payload) {
  const {
    academyId,
    firstName,
    lastName,
    dateOfBirth,
    nationality,
    gender,
    position,
    secondaryPosition,
    preferredFoot,
    height,
    weight,
    experienceYears,
    currentClub,
    photoUrl,
    visibility,
  } = payload;

  const academy = await Academy.findById(academyId);
  if (!academy) throw ApiError.notFound('Academy not found');
  if (academy.status !== 'APPROVED') {
    throw ApiError.badRequest('Academy is not approved');
  }

  const player = await Player.create({
    academyId: academy._id,
    createdBy: academy.userId,
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    nationality,
    gender: gender || 'MALE',
    position,
    secondaryPosition: secondaryPosition || '',
    preferredFoot: preferredFoot || 'RIGHT',
    height: height || null,
    weight: weight || null,
    experienceYears: experienceYears || 0,
    currentClub: currentClub || '',
    photoUrl: photoUrl || '',
    status: 'ACTIVE',
    visibility: visibility || 'ADMIN_ONLY',
  });

  return player;
}

async function generateOpportunityReference(type) {
  const count = await Opportunity.countDocuments({ type });
  let n = count + 1;
  let attempts = 0;
  while (attempts < 100) {
    const candidate = `${type}-${String(n).padStart(3, '0')}`;
    const exists = await Opportunity.findOne({ reference: candidate });
    if (!exists) return candidate;
    n += 1;
    attempts += 1;
  }
  throw ApiError.conflict('Could not generate a unique opportunity reference');
}

async function createOpportunityAsAdmin(payload) {
  const {
    type,
    category,
    title,
    country,
    city,
    level,
    description,
    criteria,
    deadline,
    visibility,
    privateNotes,
    issuingOrganizationId,
    issuingOrganizationType,
  } = payload;

  if (!['PLAYER', 'COACH'].includes(type)) {
    throw ApiError.badRequest(`Invalid type: ${type}`);
  }

  const reference = await generateOpportunityReference(type);

  const opportunity = await Opportunity.create({
    reference,
    type,
    category: category || (type === 'PLAYER' ? 'RECRUITMENT' : 'OTHER'),
    title,
    country,
    city: city || '',
    level: level || 'PROFESSIONAL',
    description: description || '',
    criteria: criteria || {},
    deadline: deadline ? new Date(deadline) : null,
    status: 'ACTIVE',
    visibility: visibility || 'NETWORK',
    source: 'ADMIN_MANUAL',
    sourceRequestId: null,
    issuingOrganizationId: issuingOrganizationId || null,
    issuingOrganizationType: issuingOrganizationType || '',
    privateNotes: privateNotes || '',
  });

  return opportunity;
}

module.exports = {
  createClubAsAdmin,
  createAcademyAsAdmin,
  createCoachAsAdmin,
  createPlayerAsAdmin,
  createOpportunityAsAdmin,
  generateTemporaryPassword,
  generateOpportunityReference,
};