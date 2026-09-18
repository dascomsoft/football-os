const { body } = require('express-validator');
const { REGISTERABLE_ROLES } = require('../services/registration.service');
const { COACH_ROLES } = require('../models/Coach.model');

const registerValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('firstName').isString().trim().notEmpty().withMessage('First name is required'),
  body('lastName').isString().trim().notEmpty().withMessage('Last name is required'),
  body('role')
    .isIn(REGISTERABLE_ROLES)
    .withMessage(`Role must be one of: ${REGISTERABLE_ROLES.join(', ')}`),
  body('phone').optional().isString().trim(),
  body('profile')
    .isObject()
    .withMessage('Profile object is required'),

  body('profile.name')
    .if(body('role').isIn(['ACADEMY', 'CLUB']))
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Profile name is required'),
  body('profile.country')
    .if(body('role').isIn(['ACADEMY', 'CLUB']))
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Profile country is required'),
  body('profile.city')
    .if(body('role').isIn(['ACADEMY', 'CLUB']))
    .optional()
    .isString()
    .trim(),
  body('profile.competition')
    .if(body('role').equals('CLUB'))
    .optional()
    .isString()
    .trim(),

  body('profile.nationality')
    .if(body('role').equals('COACH'))
    .optional()
    .isString()
    .trim(),
  body('profile.countryOfResidence')
    .if(body('role').equals('COACH'))
    .optional()
    .isString()
    .trim(),
  body('profile.primaryRole')
    .if(body('role').equals('COACH'))
    .isIn(COACH_ROLES)
    .withMessage(`Primary role must be one of: ${COACH_ROLES.join(', ')}`),
  body('profile.yearsOfExperience')
    .if(body('role').equals('COACH'))
    .optional()
    .isInt({ min: 0, max: 60 }),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, loginValidator };