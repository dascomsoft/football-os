const Coach = require('../models/Coach.model');
const ApiError = require('../utils/ApiError');

async function getCoachForUser(user) {
  const coach = await Coach.findOne({ userId: user._id });
  if (!coach) {
    throw ApiError.notFound('No coach profile attached to this account');
  }
  return coach;
}

const UPDATABLE_FIELDS = [
  'firstName',
  'lastName',
  'nationality',
  'countryOfResidence',
  'city',
  'languages',
  'primaryRole',
  'secondaryRole',
  'yearsOfExperience',
  'licenses',
  'diplomas',
  'specializations',
  'philosophy',
  'previousClubs',
  'competitions',
  'achievements',
];

async function updateCoachForUser(user, payload) {
  const coach = await getCoachForUser(user);

  UPDATABLE_FIELDS.forEach((field) => {
    if (payload[field] !== undefined) {
      coach[field] = payload[field];
    }
  });

  if (payload.availability && typeof payload.availability === 'object') {
    const allowed = ['status', 'availableFrom', 'activelyLooking', 'openToInternational'];
    allowed.forEach((key) => {
      if (payload.availability[key] !== undefined) {
        coach.availability[key] = payload.availability[key];
      }
    });
  }

  await coach.save();
  return coach;
}

async function getCoachById(coachId) {
  const coach = await Coach.findById(coachId);
  if (!coach) {
    throw ApiError.notFound('Coach not found');
  }
  return coach;
}

module.exports = {
  getCoachForUser,
  updateCoachForUser,
  getCoachById,
};