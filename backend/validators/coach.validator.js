const { body } = require('express-validator');
const {
  COACH_ROLES,
  AVAILABILITY_STATUSES,
} = require('../models/Coach.model');

const updateCoachValidator = [
  body('firstName').optional().isString().trim().notEmpty(),
  body('lastName').optional().isString().trim().notEmpty(),
  body('nationality').optional().isString().trim(),
  body('countryOfResidence').optional().isString().trim(),
  body('city').optional().isString().trim(),
  body('languages').optional().isArray(),
  body('primaryRole').optional().isIn(COACH_ROLES),
  body('secondaryRole').optional({ checkFalsy: true }).isIn(COACH_ROLES),
  body('yearsOfExperience').optional().isInt({ min: 0, max: 60 }),
  body('licenses').optional().isArray(),
  body('diplomas').optional().isArray(),
  body('specializations').optional().isArray(),
  body('philosophy').optional().isString(),
  body('previousClubs').optional().isArray(),
  body('competitions').optional().isArray(),
  body('achievements').optional().isArray(),
  body('availability').optional().isObject(),
  body('availability.status').optional().isIn(AVAILABILITY_STATUSES),
  body('availability.availableFrom').optional({ nullable: true }).isISO8601(),
  body('availability.activelyLooking').optional().isBoolean(),
  body('availability.openToInternational').optional().isBoolean(),
];

module.exports = { updateCoachValidator };