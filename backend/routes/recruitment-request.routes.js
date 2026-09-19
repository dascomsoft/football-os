const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/recruitment-request.controller');
const {
  createRecruitmentRequestValidator,
  requestIdValidator,
} = require('../validators/recruitment-request.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('CLUB', 'COACH'));

router.post('/', createRecruitmentRequestValidator, validate, controller.createRequest);
router.get('/', controller.listOwnRequests);
router.get('/:id', requestIdValidator, validate, controller.getOwnRequest);
router.patch('/:id/cancel', requestIdValidator, validate, controller.cancelOwnRequest);

module.exports = router;