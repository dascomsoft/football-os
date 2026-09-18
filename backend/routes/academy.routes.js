const express = require('express');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

// Les routes Academy seront ajoutees lors de la Phase 3.

module.exports = router;