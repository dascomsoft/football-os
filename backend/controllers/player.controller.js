const playerService = require('../services/player.service');
const ApiError = require('../utils/ApiError');

async function createPlayer(req, res) {
  const player = await playerService.createPlayer(req.user, req.body);
  res.status(201).json({ player: player.toPublicJSON() });
}

async function listMyPlayers(req, res) {
  const filters = {
    position: req.query.position,
    nationality: req.query.nationality,
    status: req.query.status,
  };
  const players = await playerService.listPlayersForAcademy(req.user, filters);
  res.status(200).json({
    items: players.map((p) => p.toPublicJSON()),
    total: players.length,
  });
}

async function getMyPlayer(req, res) {
  const player = await playerService.getPlayerForAcademy(req.user, req.params.id);
  res.status(200).json({ player: player.toPublicJSON() });
}

async function updateMyPlayer(req, res) {
  const player = await playerService.updatePlayerForAcademy(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ player: player.toPublicJSON() });
}

async function archiveMyPlayer(req, res) {
  const player = await playerService.archivePlayerForAcademy(
    req.user,
    req.params.id
  );
  res.status(200).json({ player: player.toPublicJSON() });
}

async function adminListPlayers(req, res) {
  const filters = {
    academyId: req.query.academyId,
    position: req.query.position,
    nationality: req.query.nationality,
    status: req.query.status,
    visibility: req.query.visibility,
  };
  const players = await playerService.listAllPlayersForAdmin(filters);
  res.status(200).json({
    items: players.map((p) => p.toPublicJSON()),
    total: players.length,
  });
}

async function adminGetPlayer(req, res) {
  const player = await playerService.getPlayerForAdmin(req.params.id);
  res.status(200).json({ player: player.toPublicJSON() });
}

module.exports = {
  createPlayer,
  listMyPlayers,
  getMyPlayer,
  updateMyPlayer,
  archiveMyPlayer,
  adminListPlayers,
  adminGetPlayer,
};