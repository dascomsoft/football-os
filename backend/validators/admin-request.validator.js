const { body, param } = require('express-validator');
const { VISIBILITIES } = require('../models/Opportunity.model');

const requestIdValidator = [param('id').isMongoId()];

const approveValidator = [
  param('id').isMongoId(),
  body('visibility').optional().isIn(VISIBILITIES),
  body('privateNotes').optional().isString(),
];

const rejectValidator = [
  param('id').isMongoId(),
  body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
];

const requestInfoValidator = [
  param('id').isMongoId(),
  body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
];

module.exports = {
  requestIdValidator,
  approveValidator,
  rejectValidator,
  requestInfoValidator,
}; 