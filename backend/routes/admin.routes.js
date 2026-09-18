const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());
router.use(authorize('ADMIN'));

router.get('/profiles/:type/pending', adminController.listPending);
router.get('/profiles/:type', adminController.listByStatus);
router.patch('/profiles/:type/:id/status', adminController.updateStatus);

module.exports = router;