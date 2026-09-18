const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { comparePassword } = require('../services/password.service');
const { signToken } = require('../services/token.service');
const { registerUser } = require('../services/registration.service');

async function register(req, res) {
  const { user, profile } = await registerUser(req.body);
  const token = signToken(user);

  res.status(201).json({
    token,
    user: user.toJSON(),
    profile: profile.toJSON ? profile.toJSON() : profile,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
    throw ApiError.forbidden('Account is not allowed to access the platform');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const safeUser = user.toJSON();
  const token = signToken(user);

  res.status(200).json({ token, user: safeUser });
}

async function me(req, res) {
  res.status(200).json({ user: req.user.toJSON() });
}

module.exports = { register, login, me };