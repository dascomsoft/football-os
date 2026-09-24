const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/admin-proposal.controller');
const {
  createProposalValidator,
  proposalIdValidator,
  closeValidator,
} = require('../validators/proposal.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('ADMIN'));

router.post('/', createProposalValidator, validate, controller.createProposal);
router.get('/', controller.listProposals);
router.get('/:id', proposalIdValidator, validate, controller.getProposal);
router.post('/:id/send', proposalIdValidator, validate, controller.sendProposal);
router.post('/:id/close', closeValidator, validate, controller.closeProposal);

module.exports = router;