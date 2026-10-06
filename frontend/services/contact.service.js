import api from '@/lib/api';

async function listContacts(filters = {}) {
  const params = {};
  if (filters.type) params.type = filters.type;
  if (filters.relationshipStatus) params.relationshipStatus = filters.relationshipStatus;
  if (filters.country) params.country = filters.country;
  if (filters.tag) params.tag = filters.tag;
  if (filters.search) params.search = filters.search;

  const { data } = await api.get('/admin/contacts', { params });
  return data;
}

async function getContact(id) {
  const { data } = await api.get(`/admin/contacts/${id}`);
  return data;
}

async function createContact(payload) {
  const { data } = await api.post('/admin/contacts', payload);
  return data;
}

async function updateContact(id, payload) {
  const { data } = await api.patch(`/admin/contacts/${id}`, payload);
  return data;
}

async function deleteContact(id) {
  const { data } = await api.delete(`/admin/contacts/${id}`);
  return data;
}

async function listInteractions(contactId) {
  const { data } = await api.get(`/admin/contacts/${contactId}/interactions`);
  return data;
}

async function createInteraction(contactId, payload) {
  const { data } = await api.post(
    `/admin/contacts/${contactId}/interactions`,
    payload
  );
  return data;
}

async function deleteInteraction(contactId, id) {
  const { data } = await api.delete(
    `/admin/contacts/${contactId}/interactions/${id}`
  );
  return data;
}

const contactService = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  listInteractions,
  createInteraction,
  deleteInteraction,
};

export default contactService;