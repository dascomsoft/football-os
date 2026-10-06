import api from '@/lib/api';

// --- Cote ADMIN ---
async function listAdminProposals(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.opportunityId) params.opportunityId = filters.opportunityId;
  if (filters.clubId) params.clubId = filters.clubId;
  if (filters.candidateType) params.candidateType = filters.candidateType;

  const { data } = await api.get('/admin/proposals', { params });
  return data;
}

async function getAdminProposal(id) {
  const { data } = await api.get(`/admin/proposals/${id}`);
  return data;
}

async function createProposal(payload) {
  const { data } = await api.post('/admin/proposals', payload);
  return data;
}

async function sendProposal(id) {
  const { data } = await api.post(`/admin/proposals/${id}/send`);
  return data;
}

async function closeProposal(id, payload) {
  const { data } = await api.post(`/admin/proposals/${id}/close`, payload);
  return data;
}

async function markOutcome(id, payload) {
  const { data } = await api.post(`/admin/proposals/${id}/outcome`, payload);
  return data;
}

// --- Cote CLUB ---
async function listClubProposals(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;

  const { data } = await api.get('/club/proposals', { params });
  return data;
}

async function getClubProposal(id) {
  const { data } = await api.get(`/club/proposals/${id}`);
  return data;
}

async function markViewed(id) {
  const { data } = await api.post(`/club/proposals/${id}/viewed`);
  return data;
}

async function markInterested(id, payload) {
  const { data } = await api.post(`/club/proposals/${id}/interested`, payload);
  return data;
}

async function markDeclined(id, payload) {
  const { data } = await api.post(`/club/proposals/${id}/declined`, payload);
  return data;
}

const proposalService = {
  listAdminProposals,
  getAdminProposal,
  createProposal,
  sendProposal,
  closeProposal,
  markOutcome,
  listClubProposals,
  getClubProposal,
  markViewed,
  markInterested,
  markDeclined,
};

export default proposalService;