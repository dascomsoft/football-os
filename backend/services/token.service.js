const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired token');
  }
}

module.exports = { signToken, verifyToken };