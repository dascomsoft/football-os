import api from '@/lib/api';

async function listMyPlayers(filters = {}) {
  const params = {};
  if (filters.position) params.position = filters.position;
  if (filters.nationality) params.nationality = filters.nationality;
  if (filters.status) params.status = filters.status;

  const { data } = await api.get('/players/me', { params });
  return data;
}

async function getMyPlayer(id) {
  const { data } = await api.get(`/players/me/${id}`);
  return data;
}

async function createPlayer(payload) {
  const { data } = await api.post('/players/me', payload);
  return data;
}

async function updatePlayer(id, payload) {
  const { data } = await api.patch(`/players/me/${id}`, payload);
  return data;
}

async function archivePlayer(id) {
  const { data } = await api.delete(`/players/me/${id}`);
  return data;
}

const playerService = {
  listMyPlayers,
  getMyPlayer,
  createPlayer,
  updatePlayer,
  archivePlayer,
};

export default playerService;