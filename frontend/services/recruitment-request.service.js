import api from '@/lib/api';

async function listMyRequests(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;

  const { data } = await api.get('/recruitment-requests', { params });
  return data;
}

async function getMyRequest(id) {
  const { data } = await api.get(`/recruitment-requests/${id}`);
  return data;
}

async function createRequest(payload) {
  const { data } = await api.post('/recruitment-requests', payload);
  return data;
}

async function cancelRequest(id) {
  const { data } = await api.patch(`/recruitment-requests/${id}/cancel`);
  return data;
}

const recruitmentRequestService = {
  listMyRequests,
  getMyRequest,
  createRequest,
  cancelRequest,
};

export default recruitmentRequestService;