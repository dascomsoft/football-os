const coachService = require('../services/coach.service');

async function getMe(req, res) {
  const coach = await coachService.getCoachForUser(req.user);
  res.status(200).json({ coach: coach.toJSON() });
}

async function updateMe(req, res) {
  const coach = await coachService.updateCoachForUser(req.user, req.body);
  res.status(200).json({ coach: coach.toJSON() });
}

module.exports = { getMe, updateMe };