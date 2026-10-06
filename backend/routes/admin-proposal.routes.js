const express = require('express');
const { body, param } = require('express-validator');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/admin-proposal.controller');
const {
  createProposalValidator,
  proposalIdValidator,
  closeValidator,
} = require('../validators/proposal.validator');

const markOutcomeValidator = [
  param('id').isMongoId(),
  body('status').isIn(['PLACED', 'FAILED']),
  body('outcome').optional().isIn(['NONE', 'PLACED', 'FAILED', 'ABANDONED']),
  body('outcomeDate').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('outcomeNotes').optional().isString().trim().isLength({ max: 4000 }),
];

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('ADMIN'));

router.post('/', createProposalValidator, validate, controller.createProposal);
router.get('/', controller.listProposals);
router.get('/:id', proposalIdValidator, validate, controller.getProposal);
router.post('/:id/send', proposalIdValidator, validate, controller.sendProposal);
router.post('/:id/close', closeValidator, validate, controller.closeProposal);
router.post('/:id/outcome', markOutcomeValidator, validate, controller.markOutcome);

module.exports = router;