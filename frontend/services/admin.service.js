import api from '@/lib/api';

async function listPendingProfiles(type) {
  const { data } = await api.get(`/admin/profiles/${type}/pending`);
  return data;
}

async function listProfilesByStatus(type, status) {
  const params = {};
  if (status) params.status = status;
  const { data } = await api.get(`/admin/profiles/${type}`, { params });
  return data;
}

async function updateProfileStatus(type, id, payload) {
  const { data } = await api.patch(
    `/admin/profiles/${type}/${id}/status`,
    payload
  );
  return data;
}

const adminService = { listPendingProfiles, listProfilesByStatus, updateProfileStatus };

export default adminService;