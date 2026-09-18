import api from '@/lib/api';

async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

const authService = { register, login, fetchMe };

export default authService;