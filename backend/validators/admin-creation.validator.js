const { body } = require('express-validator');
const { COACH_ROLES } = require('../models/Coach.model');
const { POSITIONS, FEET, VISIBILITIES } = require('../models/Player.model');
const {
  VISIBILITIES: OPP_VISIBILITIES,
  TYPES: OPP_TYPES,
} = require('../models/Opportunity.model');

const baseUserFields = [
  body('email').isEmail().normalizeEmail(),
  body('firstName').isString().trim().notEmpty(),
  body('lastName').isString().trim().notEmpty(),
  body('phone').optional().isString().trim(),
];

const createClubValidator = [
  ...baseUserFields,
  body('name').isString().trim().notEmpty(),
  body('country').isString().trim().notEmpty(),
  body('city').optional().isString().trim(),
  body('competition').optional().isString().trim(),
  body('foundedYear').optional({ nullable: true }).isInt({ min: 1850, max: 2100 }),
  body('description').optional().isString().trim(),
];

const createAcademyValidator = [
  ...baseUserFields,
  body('name').isString().trim().notEmpty(),
  body('country').isString().trim().notEmpty(),
  body('city').optional().isString().trim(),
  body('foundedYear').optional({ nullable: true }).isInt({ min: 1850, max: 2100 }),
  body('description').optional().isString().trim(),
];

const createCoachValidator = [
  ...baseUserFields,
  body('nationality').optional().isString().trim(),
  body('countryOfResidence').optional().isString().trim(),
  body('city').optional().isString().trim(),
  body('primaryRole').isIn(COACH_ROLES),
  body('yearsOfExperience').optional({ nullable: true }).isInt({ min: 0, max: 60 }),
  body('licenses').optional().isArray(),
];

const createPlayerValidator = [
  body('academyId').isMongoId(),
  body('firstName').isString().trim().notEmpty(),
  body('lastName').isString().trim().notEmpty(),
  body('dateOfBirth').isISO8601(),
  body('nationality').isString().trim().notEmpty(),
  body('gender').optional().isIn(['MALE', 'FEMALE']),
  body('position').isIn(POSITIONS),
  body('secondaryPosition').optional({ checkFalsy: true }).isIn(POSITIONS),
  body('preferredFoot').optional().isIn(FEET),
  body('height').optional({ nullable: true }).isInt({ min: 100, max: 250 }),
  body('weight').optional({ nullable: true }).isInt({ min: 30, max: 150 }),
  body('experienceYears').optional({ nullable: true }).isInt({ min: 0, max: 40 }),
  body('currentClub').optional().isString().trim(),
  body('photoUrl').optional().isString().trim(),
  body('visibility').optional().isIn(VISIBILITIES),
];

const createOpportunityValidator = [
  body('type').isIn(OPP_TYPES),
  body('category').optional().isString().trim(),
  body('title').isString().trim().notEmpty(),
  body('country').isString().trim().notEmpty(),
  body('city').optional().isString().trim(),
  body('level').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('criteria').optional().isObject(),
  body('deadline').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('visibility').optional().isIn(OPP_VISIBILITIES),
  body('privateNotes').optional().isString().trim(),
  body('issuingOrganizationId')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId(),
  body('issuingOrganizationType')
    .optional()
    .isIn(['CLUB', 'ACADEMY', 'COACH', '']),
];

module.exports = {
  createClubValidator,
  createAcademyValidator,
  createCoachValidator,
  createPlayerValidator,
  createOpportunityValidator,
};