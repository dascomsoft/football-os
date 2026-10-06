const adminCreationService = require('../services/admin-creation.service');

async function createClub(req, res) {
  const { user, profile, temporaryPassword } =
    await adminCreationService.createClubAsAdmin(req.body);
  res.status(201).json({
    user: user.toJSON(),
    profile: profile.toJSON(),
    temporaryPassword,
  });
}

async function createAcademy(req, res) {
  const { user, profile, temporaryPassword } =
    await adminCreationService.createAcademyAsAdmin(req.body);
  res.status(201).json({
    user: user.toJSON(),
    profile: profile.toJSON(),
    temporaryPassword,
  });
}

async function createCoach(req, res) {
  const { user, profile, temporaryPassword } =
    await adminCreationService.createCoachAsAdmin(req.body);
  res.status(201).json({
    user: user.toJSON(),
    profile: profile.toJSON(),
    temporaryPassword,
  });
}

async function createPlayer(req, res) {
  const player = await adminCreationService.createPlayerAsAdmin(req.body);
  res.status(201).json({ player: player.toPublicJSON() });
}

async function createOpportunity(req, res) {
  const opportunity = await adminCreationService.createOpportunityAsAdmin(
    req.body
  );
  res.status(201).json({ opportunity: opportunity.toAdminJSON() });
}

module.exports = {
  createClub,
  createAcademy,
  createCoach,
  createPlayer,
  createOpportunity,
};