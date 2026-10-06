const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/contact.controller');
const {
  contactIdValidator,
  interactionIdValidator,
  contactFiltersValidator,
  createContactValidator,
  updateContactValidator,
  createInteractionValidator,
} = require('../validators/contact.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('ADMIN'));

router.get('/', contactFiltersValidator, validate, controller.listContacts);
router.post('/', createContactValidator, validate, controller.createContact);

router.get('/:id', contactIdValidator, validate, controller.getContact);
router.patch('/:id', updateContactValidator, validate, controller.updateContact);
router.delete('/:id', contactIdValidator, validate, controller.deleteContact);

router.get(
  '/:id/interactions',
  contactIdValidator,
  validate,
  controller.listInteractions
);

router.post(
  '/:contactId/interactions',
  createInteractionValidator,
  validate,
  controller.createInteraction
);

router.delete(
  '/:contactId/interactions/:id',
  interactionIdValidator,
  validate,
  controller.deleteInteraction
);

module.exports = router;