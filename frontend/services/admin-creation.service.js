import api from '@/lib/api';

async function createClub(payload) {
  const { data } = await api.post('/admin/clubs', payload);
  return data;
}

async function createAcademy(payload) {
  const { data } = await api.post('/admin/academies', payload);
  return data;
}

async function createCoach(payload) {
  const { data } = await api.post('/admin/coaches', payload);
  return data;
}

async function createPlayer(payload) {
  const { data } = await api.post('/admin/players', payload);
  return data;
}

async function createOpportunity(payload) {
  const { data } = await api.post('/admin/opportunities', payload);
  return data;
}

const adminCreationService = {
  createClub,
  createAcademy,
  createCoach,
  createPlayer,
  createOpportunity,
};

export default adminCreationService;