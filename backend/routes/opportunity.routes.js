const express = require('express');
const { param } = require('express-validator');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/opportunity.controller');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('ACADEMY', 'CLUB', 'COACH'));

router.get('/', controller.listOpportunities);
router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  controller.getOpportunity
);

module.exports = router;