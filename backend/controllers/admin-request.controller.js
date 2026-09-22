const opportunityService = require('../services/opportunity.service');

async function listRequests(req, res) {
  const filters = {
    status: req.query.status,
    type: req.query.type,
    country: req.query.country,
  };
  const items = await opportunityService.listRequestsForAdmin(filters);
  res.status(200).json({
    items: items.map((r) => r.toJSON()),
    total: items.length,
  });
}

async function getRequest(req, res) {
  const request = await opportunityService.getRequestForAdmin(req.params.id);
  res.status(200).json({ request: request.toJSON() });
}

async function approveRequest(req, res) {
  const { visibility, privateNotes } = req.body || {};
  const { request, opportunity } = await opportunityService.approveRequest(
    req.params.id,
    req.user,
    { visibility, privateNotes }
  );

  res.status(200).json({
    request: request.toJSON(),
    opportunity: opportunity.toAdminJSON(),
  });
}

async function rejectRequest(req, res) {
  const { reason } = req.body || {};
  const request = await opportunityService.rejectRequest(
    req.params.id,
    req.user,
    reason
  );
  res.status(200).json({ request: request.toJSON() });
}

async function requestInfo(req, res) {
  const { reason } = req.body || {};
  const request = await opportunityService.requestInfoRequest(
    req.params.id,
    req.user,
    reason
  );
  res.status(200).json({ request: request.toJSON() });
}





async function listOpportunities(req, res) {
  const filters = {
    status: req.query.status,
    type: req.query.type,
    visibility: req.query.visibility,
  };
  const items = await opportunityService.listAllOpportunitiesForAdmin(filters);
  res.status(200).json({
    items: items.map((o) => o.toAdminJSON()),
    total: items.length,
  });
}






module.exports = {
  listRequests,
  getRequest,
  approveRequest,
  rejectRequest,
  requestInfo,
  listOpportunities,
};