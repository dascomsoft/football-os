const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/club-proposal.controller');
const {
  proposalIdValidator,
  clubResponseValidator,
  declineValidator,
} = require('../validators/proposal.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('CLUB'));

router.get('/', controller.listProposals);
router.get('/:id', proposalIdValidator, validate, controller.getProposal);
router.post('/:id/viewed', proposalIdValidator, validate, controller.markViewed);
router.post('/:id/interested', clubResponseValidator, validate, controller.markInterested);
router.post('/:id/declined', declineValidator, validate, controller.markDeclined);

module.exports = router;