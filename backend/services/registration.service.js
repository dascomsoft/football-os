const User = require('../models/User.model');
const Academy = require('../models/Academy.model');
const Club = require('../models/Club.model');
const Coach = require('../models/Coach.model');
const ApiError = require('../utils/ApiError');
const { hashPassword } = require('./password.service');

const REGISTERABLE_ROLES = ['ACADEMY', 'CLUB', 'COACH'];

function validateRole(role) {
  if (!REGISTERABLE_ROLES.includes(role)) {
    throw ApiError.badRequest(
      `Role must be one of: ${REGISTERABLE_ROLES.join(', ')}`
    );
  }
}

async function createAcademyProfile(userId, payload) {
  return Academy.create({
    userId,
    name: payload.name,
    country: payload.country,
    city: payload.city || '',
    status: 'PENDING',
  });
}

async function createClubProfile(userId, payload) {
  return Club.create({
    userId,
    name: payload.name,
    country: payload.country,
    city: payload.city || '',
    competition: payload.competition || '',
    status: 'PENDING',
  });
}

async function createCoachProfile(userId, payload) {
  return Coach.create({
    userId,
    firstName: payload.firstName,
    lastName: payload.lastName,
    nationality: payload.nationality || '',
    countryOfResidence: payload.countryOfResidence || '',
    primaryRole: payload.primaryRole,
    yearsOfExperience: payload.yearsOfExperience || 0,
    status: 'PENDING',
  });
}

async function registerUser(payload) {
  const { email, password, firstName, lastName, role, phone, profile } = payload;

  validateRole(role);

  if (!profile || typeof profile !== 'object') {
    throw ApiError.badRequest('Profile data is required for this role');
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw ApiError.conflict('Email already registered');
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    firstName,
    lastName,
    phone: phone || '',
    role,
    status: 'PENDING',
  });

  try {
    let profileDoc = null;

    if (role === 'ACADEMY') {
      profileDoc = await createAcademyProfile(user._id, profile);
    } else if (role === 'CLUB') {
      profileDoc = await createClubProfile(user._id, profile);
    } else if (role === 'COACH') {
      profileDoc = await createCoachProfile(user._id, {
        firstName,
        lastName,
        ...profile,
      });
    }

    if (!profileDoc) {
      throw ApiError.badRequest(`Unsupported role for profile creation: ${role}`);
    }

    return { user, profile: profileDoc };
  } catch (error) {
    // Rollback : on supprime le User pour eviter un orphelin
    try {
      await User.findByIdAndDelete(user._id);
    } catch (rollbackError) {
      console.error(
        '[registration] Rollback failed for user',
        user._id.toString(),
        rollbackError.message
      );
    }
    throw error;
  }
}

module.exports = { registerUser, REGISTERABLE_ROLES };