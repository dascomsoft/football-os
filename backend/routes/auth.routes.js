const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;