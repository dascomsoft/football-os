const { body, param } = require('express-validator');
const { CANDIDATE_TYPES } = require('../models/Proposal.model');

const createProposalValidator = [
  body('opportunityId').isMongoId(),
  body('clubId').isMongoId(),
  body('candidateType').isIn(CANDIDATE_TYPES),
  body('candidateId').isMongoId(),
  body('message').optional().isString().trim().isLength({ max: 4000 }),
  body('sharedVideos').optional().isArray(),
  body('sharedVideos.*.url').optional().isString().trim().notEmpty(),
  body('sharedVideos.*.title').optional().isString().trim(),
  body('sharedVideos.*.type')
    .optional()
    .isIn(['HIGHLIGHTS', 'FULL_MATCH', 'TRAINING', 'SKILLS', 'OTHER']),
];

const proposalIdValidator = [param('id').isMongoId()];

const clubResponseValidator = [
  param('id').isMongoId(),
  body('response').optional().isString().trim().isLength({ max: 4000 }),
];

const declineValidator = [
  param('id').isMongoId(),
  body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
];

const closeValidator = [
  param('id').isMongoId(),
  body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
];

module.exports = {
  createProposalValidator,
  proposalIdValidator,
  clubResponseValidator,
  declineValidator,
  closeValidator,
};