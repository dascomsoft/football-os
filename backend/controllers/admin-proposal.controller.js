const proposalService = require('../services/proposal.service');

async function createProposal(req, res) {
  const proposal = await proposalService.createProposal(req.user, req.body);
  const view = await proposalService.buildAdminProposalView(proposal);
  res.status(201).json(view);
}

async function listProposals(req, res) {
  const filters = {
    status: req.query.status,
    opportunityId: req.query.opportunityId,
    clubId: req.query.clubId,
    candidateType: req.query.candidateType,
  };

  const items = await proposalService.listProposalsForAdmin(filters);
  const views = await Promise.all(
    items.map((p) => proposalService.buildAdminProposalView(p))
  );

  res.status(200).json({ items: views, total: views.length });
}

async function getProposal(req, res) {
  const proposal = await proposalService.getProposalForAdmin(req.params.id);
  const view = await proposalService.buildAdminProposalView(proposal);
  res.status(200).json(view);
}

async function sendProposal(req, res) {
  const proposal = await proposalService.sendProposal(req.user, req.params.id);
  const view = await proposalService.buildAdminProposalView(proposal);
  res.status(200).json(view);
}

async function closeProposal(req, res) {
  const { reason } = req.body || {};
  const proposal = await proposalService.closeProposal(
    req.user,
    req.params.id,
    reason
  );
  const view = await proposalService.buildAdminProposalView(proposal);
  res.status(200).json(view);
}

module.exports = {
  createProposal,
  listProposals,
  getProposal,
  sendProposal,
  closeProposal,
};