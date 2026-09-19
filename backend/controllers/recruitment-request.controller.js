const requestService = require('../services/recruitment-request.service');

async function createRequest(req, res) {
  const request = await requestService.createRequest(req.user, req.body);
  res.status(201).json({ request: request.toJSON() });
}

async function listOwnRequests(req, res) {
  const filters = {
    status: req.query.status,
    type: req.query.type,
  };
  const items = await requestService.listOwnRequests(req.user, filters);
  res.status(200).json({
    items: items.map((r) => r.toJSON()),
    total: items.length,
  });
}

async function getOwnRequest(req, res) {
  const request = await requestService.getOwnRequest(req.user, req.params.id);
  res.status(200).json({ request: request.toJSON() });
}

async function cancelOwnRequest(req, res) {
  const request = await requestService.cancelOwnRequest(req.user, req.params.id);
  res.status(200).json({ request: request.toJSON() });
}

module.exports = {
  createRequest,
  listOwnRequests,
  getOwnRequest,
  cancelOwnRequest,
};