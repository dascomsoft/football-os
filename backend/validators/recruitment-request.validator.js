const { body, param } = require('express-validator');
const {
  TYPES,
  LEVELS,
  POSITIONS,
  FEET,
  COACH_ROLES,
} = require('../models/RecruitmentRequest.model');

const createRecruitmentRequestValidator = [
  body('type')
    .isIn(TYPES)
    .withMessage(`Type must be one of: ${TYPES.join(', ')}`),
  body('title')
    .isString()
    .trim()
    .isLength({ min: 4, max: 160 })
    .withMessage('Title must be between 4 and 160 characters'),
  body('country').isString().trim().notEmpty().withMessage('Country is required'),
  body('city').optional().isString().trim(),
  body('level').optional().isIn(LEVELS),
  body('description').optional().isString().trim().isLength({ max: 4000 }),
  body('deadline').optional({ nullable: true, checkFalsy: true }).isISO8601(),

  // PLAYER
  body('playerCriteria')
    .if(body('type').equals('PLAYER'))
    .isObject()
    .withMessage('playerCriteria is required for PLAYER type'),
  body('playerCriteria.position')
    .if(body('type').equals('PLAYER'))
    .isIn(POSITIONS)
    .withMessage(`playerCriteria.position must be one of: ${POSITIONS.join(', ')}`),
  body('playerCriteria.secondaryPosition')
    .if(body('type').equals('PLAYER'))
    .optional({ checkFalsy: true })
    .isIn(POSITIONS),
  body('playerCriteria.ageMin')
    .if(body('type').equals('PLAYER'))
    .optional({ nullable: true })
    .isInt({ min: 10, max: 50 }),
  body('playerCriteria.ageMax')
    .if(body('type').equals('PLAYER'))
    .optional({ nullable: true })
    .isInt({ min: 10, max: 50 }),
  body('playerCriteria.nationality')
    .if(body('type').equals('PLAYER'))
    .optional()
    .isString()
    .trim(),
  body('playerCriteria.preferredFoot')
    .if(body('type').equals('PLAYER'))
    .optional({ checkFalsy: true })
    .isIn(FEET),
  body('playerCriteria.heightMin')
    .if(body('type').equals('PLAYER'))
    .optional({ nullable: true })
    .isInt({ min: 120, max: 220 }),
  body('playerCriteria.experienceMin')
    .if(body('type').equals('PLAYER'))
    .optional({ nullable: true })
    .isInt({ min: 0, max: 30 }),

  // COACH
  body('coachCriteria')
    .if(body('type').equals('COACH'))
    .isObject()
    .withMessage('coachCriteria is required for COACH type'),
  body('coachCriteria.role')
    .if(body('type').equals('COACH'))
    .isIn(COACH_ROLES)
    .withMessage(`coachCriteria.role must be one of: ${COACH_ROLES.join(', ')}`),
  body('coachCriteria.license').optional().isString().trim(),
  body('coachCriteria.experienceMin')
    .if(body('type').equals('COACH'))
    .optional({ nullable: true })
    .isInt({ min: 0, max: 40 }),
  body('coachCriteria.language').optional().isArray(),
  body('coachCriteria.category').optional().isString().trim(),
];

const requestIdValidator = [param('id').isMongoId()];

module.exports = {
  createRecruitmentRequestValidator,
  requestIdValidator,
};