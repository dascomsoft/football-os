import api from '@/lib/api';

async function listRequests(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;
  if (filters.country) params.country = filters.country;

  const { data } = await api.get('/admin/requests', { params });
  return data;
}

async function getRequest(id) {
  const { data } = await api.get(`/admin/requests/${id}`);
  return data;
}

async function approveRequest(id, payload) {
  const { data } = await api.post(`/admin/requests/${id}/approve`, payload);
  return data;
}

async function rejectRequest(id, payload) {
  const { data } = await api.post(`/admin/requests/${id}/reject`, payload);
  return data;
}

async function requestInfo(id, payload) {
  const { data } = await api.post(`/admin/requests/${id}/request-info`, payload);
  return data;
}

const adminRequestService = {
  listRequests,
  getRequest,
  approveRequest,
  rejectRequest,
  requestInfo,
};

export default adminRequestService;