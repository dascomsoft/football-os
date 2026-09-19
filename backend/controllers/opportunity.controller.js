const opportunityService = require('../services/opportunity.service');

async function listOpportunities(req, res) {
  const filters = {
    type: req.query.type,
    country: req.query.country,
    level: req.query.level,
  };

  const items = await opportunityService.listPublicOpportunities(
    req.user,
    filters
  );

  res.status(200).json({
    items: items.map((o) => o.toPublicJSON()),
    total: items.length,
  });
}

async function getOpportunity(req, res) {
  const opp = await opportunityService.getPublicOpportunity(
    req.user,
    req.params.id
  );
  res.status(200).json({ opportunity: opp.toPublicJSON() });
}

module.exports = { listOpportunities, getOpportunity };