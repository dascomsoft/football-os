import api from '@/lib/api';

async function listNotifications(filters = {}) {
  const params = {};
  if (filters.unreadOnly) params.unreadOnly = 'true';

  const { data } = await api.get('/notifications', { params });
  return data;
}

async function unreadCount() {
  const { data } = await api.get('/notifications/unread-count');
  return data;
}

async function markRead(id) {
  const { data } = await api.post(`/notifications/${id}/read`);
  return data;
}

async function markAllRead() {
  const { data } = await api.post('/notifications/read-all');
  return data;
}

const notificationService = {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
};

export default notificationService;