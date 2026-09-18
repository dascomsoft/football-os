const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../services/token.service');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw ApiError.unauthorized('Missing or malformed Authorization header');
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized('User no longer exists');
    }

    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      throw ApiError.forbidden('Account is not allowed to access the platform');
    }

    req.user = user;
    req.auth = { role: user.role };
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authenticate;