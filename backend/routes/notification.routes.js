const express = require('express');
const { param } = require('express-validator');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/notification.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', controller.listNotifications);
router.get('/unread-count', controller.unreadCount);
router.post('/read-all', controller.markAllRead);
router.post(
  '/:id/read',
  [param('id').isMongoId()],
  validate,
  controller.markRead
);

module.exports = router;