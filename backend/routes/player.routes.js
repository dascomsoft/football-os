const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const { authorize, requireApproved } = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const playerController = require('../controllers/player.controller');
const {
  createPlayerValidator,
  updatePlayerValidator,
  playerIdValidator,
} = require('../validators/player.validator');

const router = express.Router();

router.use(authenticate);
router.use(requireApproved());

// Routes ACADEMY : scoped a l'academie du user connecte
router.post(
  '/me',
  authorize('ACADEMY'),
  createPlayerValidator,
  validate,
  playerController.createPlayer
);

router.get('/me', authorize('ACADEMY'), playerController.listMyPlayers);

router.get(
  '/me/:id',
  authorize('ACADEMY'),
  playerIdValidator,
  validate,
  playerController.getMyPlayer
);

router.patch(
  '/me/:id',
  authorize('ACADEMY'),
  updatePlayerValidator,
  validate,
  playerController.updateMyPlayer
);

router.delete(
  '/me/:id',
  authorize('ACADEMY'),
  playerIdValidator,
  validate,
  playerController.archiveMyPlayer
);

// Routes ADMIN
router.get('/admin', authorize('ADMIN'), playerController.adminListPlayers);

router.get(
  '/admin/:id',
  authorize('ADMIN'),
  playerIdValidator,
  validate,
  playerController.adminGetPlayer
);

module.exports = router;