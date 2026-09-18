const User = require('../models/User.model');
const Academy = require('../models/Academy.model');
const Club = require('../models/Club.model');
const Coach = require('../models/Coach.model');
const ApiError = require('../utils/ApiError');

const MODEL_BY_TYPE = {
  ACADEMY: Academy,
  CLUB: Club,
  COACH: Coach,
};

const ALLOWED_TRANSITIONS = {
  PENDING: ['APPROVED', 'REJECTED', 'REQUESTED_INFO'],
  REQUESTED_INFO: ['APPROVED', 'REJECTED'],
  APPROVED: ['SUSPENDED', 'BLOCKED'],
  SUSPENDED: ['APPROVED', 'BLOCKED'],
  REJECTED: ['REQUESTED_INFO'],
  BLOCKED: [],
};

const REASON_REQUIRED = ['REJECTED', 'SUSPENDED', 'BLOCKED', 'REQUESTED_INFO'];

function getModelOrThrow(type) {
  const Model = MODEL_BY_TYPE[type];
  if (!Model) {
    throw ApiError.badRequest(`Invalid profile type: ${type}`);
  }
  return Model;
}

async function listPending(req, res) {
  const { type } = req.params;
  const Model = getModelOrThrow(type);

  const profiles = await Model.find({ status: 'PENDING' })
    .sort({ createdAt: 1 })
    .lean();

  res.status(200).json({ items: profiles, total: profiles.length });
}

async function listByStatus(req, res) {
  const { type } = req.params;
  const { status } = req.query;
  const Model = getModelOrThrow(type);

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const profiles = await Model.find(filter).sort({ createdAt: -1 }).lean();
  res.status(200).json({ items: profiles, total: profiles.length });
}

async function updateStatus(req, res) {
  const { type, id } = req.params;
  const { status, reason } = req.body;

  const Model = getModelOrThrow(type);

  const profile = await Model.findById(id);
  if (!profile) {
    throw ApiError.notFound('Profile not found');
  }

  const current = profile.status;
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  if (!allowed.includes(status)) {
    throw ApiError.badRequest(
      `Cannot transition from ${current} to ${status}`
    );
  }

  if (REASON_REQUIRED.includes(status) && (!reason || !reason.trim())) {
    throw ApiError.badRequest(`Reason is required when setting status to ${status}`);
  }

  profile.status = status;
  profile.statusReason = reason ? reason.trim() : '';
  await profile.save();

  // Synchronise le statut du compte User associe
  const userStatusMap = {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    REQUESTED_INFO: 'REQUESTED_INFO',
    SUSPENDED: 'SUSPENDED',
    BLOCKED: 'BLOCKED',
    PENDING: 'PENDING',
  };
  await User.findByIdAndUpdate(profile.userId, {
    status: userStatusMap[status] || 'PENDING',
  });

  res.status(200).json({ profile });
}

module.exports = { listPending, listByStatus, updateStatus };