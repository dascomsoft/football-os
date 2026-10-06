const { body, param, query } = require('express-validator');
const {
  TYPES,
  ORGANIZATION_TYPES,
  RELATIONSHIP_STATUSES,
} = require('../models/Contact.model');
const { TYPES: INTERACTION_TYPES } = require('../models/Interaction.model');

const contactIdValidator = [param('id').isMongoId()];

const interactionIdValidator = [
  param('contactId').isMongoId(),
  param('id').isMongoId(),
];

const contactFiltersValidator = [
  query('type').optional().isIn(TYPES),
  query('relationshipStatus').optional().isIn(RELATIONSHIP_STATUSES),
  query('country').optional().isString().trim(),
  query('tag').optional().isString().trim(),
  query('search').optional().isString().trim(),
];

const createContactValidator = [
  body('type').isIn(TYPES),
  body('organizationName').isString().trim().notEmpty(),
  body('userId').optional({ nullable: true, checkFalsy: true }).isMongoId(),
  body('organizationId').optional({ nullable: true, checkFalsy: true }).isMongoId(),
  body('organizationType').optional().isIn(ORGANIZATION_TYPES),
  body('country').optional().isString().trim(),
  body('city').optional().isString().trim(),
  body('contactName').optional().isString().trim(),
  body('contactRole').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('whatsapp').optional().isString().trim(),
  body('email').optional({ checkFalsy: true }).isEmail(),
  body('socialLinks').optional().isObject(),
  body('socialLinks.linkedin').optional().isString().trim(),
  body('socialLinks.instagram').optional().isString().trim(),
  body('socialLinks.twitter').optional().isString().trim(),
  body('socialLinks.website').optional().isString().trim(),
  body('relationshipStatus').optional().isIn(RELATIONSHIP_STATUSES),
  body('tags').optional().isArray(),
  body('privateNotes').optional().isString().trim(),
];

const updateContactValidator = [
  param('id').isMongoId(),
  body('type').optional().isIn(TYPES),
  body('organizationName').optional().isString().trim().notEmpty(),
  body('userId').optional({ nullable: true, checkFalsy: true }).isMongoId(),
  body('organizationId').optional({ nullable: true, checkFalsy: true }).isMongoId(),
  body('organizationType').optional().isIn(ORGANIZATION_TYPES),
  body('country').optional().isString().trim(),
  body('city').optional().isString().trim(),
  body('contactName').optional().isString().trim(),
  body('contactRole').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('whatsapp').optional().isString().trim(),
  body('email').optional({ checkFalsy: true }).isEmail(),
  body('socialLinks').optional().isObject(),
  body('relationshipStatus').optional().isIn(RELATIONSHIP_STATUSES),
  body('tags').optional().isArray(),
  body('privateNotes').optional().isString().trim(),
];

const createInteractionValidator = [
  param('contactId').isMongoId(),
  body('type').optional().isIn(INTERACTION_TYPES),
  body('summary').isString().trim().notEmpty(),
  body('details').optional().isString().trim(),
  body('occurredAt').optional().isISO8601(),
];

module.exports = {
  contactIdValidator,
  interactionIdValidator,
  contactFiltersValidator,
  createContactValidator,
  updateContactValidator,
  createInteractionValidator,
};