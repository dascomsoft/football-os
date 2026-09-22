import api from '@/lib/api';

async function listOpportunities(filters = {}) {
  const params = {};
  if (filters.type) params.type = filters.type;
  if (filters.country) params.country = filters.country;
  if (filters.level) params.level = filters.level;

  const { data } = await api.get('/opportunities', { params });
  return data;
}

async function getOpportunity(id) {
  const { data } = await api.get(`/opportunities/${id}`);
  return data;
}

const opportunityService = {
  listOpportunities,
  getOpportunity,
};

export default opportunityService;