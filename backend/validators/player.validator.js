const { body, param } = require('express-validator');
const {
  POSITIONS,
  FEET,
  STATUSES,
  VISIBILITIES,
} = require('../models/Player.model');

const createPlayerValidator = [
  body('firstName').isString().trim().notEmpty(),
  body('lastName').isString().trim().notEmpty(),
  body('dateOfBirth').isISO8601().withMessage('dateOfBirth must be ISO8601'),
  body('nationality').isString().trim().notEmpty(),
  body('gender').optional().isIn(['MALE', 'FEMALE']),
  body('position').isIn(POSITIONS),
  body('secondaryPosition').optional({ checkFalsy: true }).isIn(POSITIONS),
  body('preferredFoot').optional().isIn(FEET),
  body('height').optional().isInt({ min: 100, max: 250 }),
  body('weight').optional().isInt({ min: 30, max: 150 }),
  body('experienceYears').optional().isInt({ min: 0, max: 40 }),
  body('currentClub').optional().isString().trim(),
  body('photoUrl').optional().isString().trim(),
  body('videos').optional().isArray(),
  body('visibility').optional().isIn(VISIBILITIES),
];

const updatePlayerValidator = [
  param('id').isMongoId(),
  body('firstName').optional().isString().trim().notEmpty(),
  body('lastName').optional().isString().trim().notEmpty(),
  body('dateOfBirth').optional().isISO8601(),
  body('nationality').optional().isString().trim().notEmpty(),
  body('gender').optional().isIn(['MALE', 'FEMALE']),
  body('position').optional().isIn(POSITIONS),
  body('secondaryPosition').optional({ checkFalsy: true }).isIn(POSITIONS),
  body('preferredFoot').optional().isIn(FEET),
  body('height').optional().isInt({ min: 100, max: 250 }),
  body('weight').optional().isInt({ min: 30, max: 150 }),
  body('experienceYears').optional().isInt({ min: 0, max: 40 }),
  body('status').optional().isIn(STATUSES),
  body('visibility').optional().isIn(VISIBILITIES),
];

const playerIdValidator = [param('id').isMongoId()];

module.exports = {
  createPlayerValidator,
  updatePlayerValidator,
  playerIdValidator,
};