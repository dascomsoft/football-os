const Player = require('../models/Player.model');
const Academy = require('../models/Academy.model');
const ApiError = require('../utils/ApiError');

async function getAcademyForUser(user) {
  const academy = await Academy.findOne({ userId: user._id });
  if (!academy) {
    throw ApiError.forbidden('No academy profile attached to this account');
  }
  return academy;
}

async function createPlayer(user, payload) {
  const academy = await getAcademyForUser(user);
  if (academy.status !== 'APPROVED') {
    throw ApiError.forbidden('Academy is not approved');
  }

  const player = await Player.create({
    ...payload,
    academyId: academy._id,
    createdBy: user._id,
    visibility: payload.visibility || 'ADMIN_ONLY',
    status: 'ACTIVE',
  });

  return player;
}

async function listPlayersForAcademy(user, filters = {}) {
  const academy = await getAcademyForUser(user);

  const query = { academyId: academy._id, status: { $ne: 'ARCHIVED' } };

  if (filters.position) query.position = filters.position;
  if (filters.nationality) query.nationality = filters.nationality;
  if (filters.status) query.status = filters.status;

  return Player.find(query).sort({ createdAt: -1 }).limit(500);
}

async function getPlayerForAcademy(user, playerId) {
  const academy = await getAcademyForUser(user);
  const player = await Player.findOne({
    _id: playerId,
    academyId: academy._id,
  });
  if (!player) {
    throw ApiError.notFound('Player not found');
  }
  return player;
}

async function updatePlayerForAcademy(user, playerId, payload) {
  const player = await getPlayerForAcademy(user, playerId);

  const updatable = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'nationality',
    'gender',
    'position',
    'secondaryPosition',
    'preferredFoot',
    'height',
    'weight',
    'experienceYears',
    'currentClub',
    'photoUrl',
    'videos',
    'status',
    'visibility',
  ];

  updatable.forEach((field) => {
    if (payload[field] !== undefined) {
      player[field] = payload[field];
    }
  });

  await player.save();
  return player;
}

async function archivePlayerForAcademy(user, playerId) {
  const player = await getPlayerForAcademy(user, playerId);
  player.status = 'ARCHIVED';
  await player.save();
  return player;
}

async function listAllPlayersForAdmin(filters = {}) {
  const query = {};
  if (filters.academyId) query.academyId = filters.academyId;
  if (filters.position) query.position = filters.position;
  if (filters.nationality) query.nationality = filters.nationality;
  if (filters.status) query.status = filters.status;
  if (filters.visibility) query.visibility = filters.visibility;

  return Player.find(query).sort({ createdAt: -1 }).limit(1000);
}

async function getPlayerForAdmin(playerId) {
  const player = await Player.findById(playerId);
  if (!player) {
    throw ApiError.notFound('Player not found');
  }
  return player;
}

module.exports = {
  createPlayer,
  listPlayersForAcademy,
  getPlayerForAcademy,
  updatePlayerForAcademy,
  archivePlayerForAcademy,
  listAllPlayersForAdmin,
  getPlayerForAdmin,
  getAcademyForUser,
};