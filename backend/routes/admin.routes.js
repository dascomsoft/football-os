const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const adminController = require('../controllers/admin.controller');
const adminRequestController = require('../controllers/admin-request.controller');
const adminCreationController = require('../controllers/admin-creation.controller');
const {
  requestIdValidator,
  approveValidator,
  rejectValidator,
  requestInfoValidator,
} = require('../validators/admin-request.validator');
const {
  createClubValidator,
  createAcademyValidator,
  createCoachValidator,
  createPlayerValidator,
  createOpportunityValidator,
} = require('../validators/admin-creation.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('ADMIN'));

// Profils : approbation, rejet, etc.
router.get('/profiles/:type/pending', adminController.listPending);
router.get('/profiles/:type', adminController.listByStatus);
router.patch('/profiles/:type/:id/status', adminController.updateStatus);

// Recruitment requests
router.get('/requests', adminRequestController.listRequests);
router.get('/requests/:id', requestIdValidator, validate, adminRequestController.getRequest);
router.post('/requests/:id/approve', approveValidator, validate, adminRequestController.approveRequest);
router.post('/requests/:id/reject', rejectValidator, validate, adminRequestController.rejectRequest);
router.post('/requests/:id/request-info', requestInfoValidator, validate, adminRequestController.requestInfo);

// Opportunites (consultation admin)
router.get('/opportunities', adminRequestController.listOpportunities);

// Creation directe par admin
router.post('/clubs', createClubValidator, validate, adminCreationController.createClub);
router.post('/academies', createAcademyValidator, validate, adminCreationController.createAcademy);
router.post('/coaches', createCoachValidator, validate, adminCreationController.createCoach);
router.post('/players', createPlayerValidator, validate, adminCreationController.createPlayer);
router.post('/opportunities', createOpportunityValidator, validate, adminCreationController.createOpportunity);

module.exports = router;