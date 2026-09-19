const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const coachController = require('../controllers/coach.controller');
const { updateCoachValidator } = require('../validators/coach.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('COACH'));

router.get('/me', coachController.getMe);
router.patch('/me', updateCoachValidator, validate, coachController.updateMe);

module.exports = router;