import api from '@/lib/api';

async function getMyCoach() {
  const { data } = await api.get('/coaches/me');
  return data;
}

async function updateMyCoach(payload) {
  const { data } = await api.patch('/coaches/me', payload);
  return data;
}

const coachService = { getMyCoach, updateMyCoach };

export default coachService;