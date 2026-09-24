const proposalService = require('../services/proposal.service');

async function listProposals(req, res) {
  const filters = { status: req.query.status };

  const items = await proposalService.listProposalsForClub(req.user, filters);
  const views = await Promise.all(
    items.map((p) => proposalService.buildClubProposalView(p))
  );

  res.status(200).json({ items: views, total: views.length });
}

async function getProposal(req, res) {
  const proposal = await proposalService.getProposalForClub(
    req.user,
    req.params.id
  );
  const view = await proposalService.buildClubProposalView(proposal);
  res.status(200).json(view);
}

async function markViewed(req, res) {
  const proposal = await proposalService.markViewed(req.user, req.params.id);
  const view = await proposalService.buildClubProposalView(proposal);
  res.status(200).json(view);
}

async function markInterested(req, res) {
  const { response } = req.body || {};
  const proposal = await proposalService.markInterested(
    req.user,
    req.params.id,
    response
  );
  const view = await proposalService.buildClubProposalView(proposal);
  res.status(200).json(view);
}

async function markDeclined(req, res) {
  const { reason } = req.body || {};
  const proposal = await proposalService.markDeclined(
    req.user,
    req.params.id,
    reason
  );
  const view = await proposalService.buildClubProposalView(proposal);
  res.status(200).json(view);
}

module.exports = {
  listProposals,
  getProposal,
  markViewed,
  markInterested,
  markDeclined,
};