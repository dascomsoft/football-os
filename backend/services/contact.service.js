const Contact = require('../models/Contact.model');
const Interaction = require('../models/Interaction.model');
const ApiError = require('../utils/ApiError');

async function listContacts(adminUser, filters = {}) {
  const query = {
    ownerId: adminUser._id,
    deletedAt: null,
  };

  if (filters.type) query.type = filters.type;
  if (filters.relationshipStatus) query.relationshipStatus = filters.relationshipStatus;
  if (filters.country) query.country = filters.country;
  if (filters.tag) query.tags = filters.tag;

  if (filters.search) {
    const regex = new RegExp(filters.search.trim(), 'i');
    query.$or = [
      { organizationName: regex },
      { contactName: regex },
      { email: regex },
    ];
  }

  return Contact.find(query).sort({ createdAt: -1 }).limit(500);
}

async function getContact(adminUser, contactId) {
  const contact = await Contact.findOne({
    _id: contactId,
    ownerId: adminUser._id,
    deletedAt: null,
  });
  if (!contact) {
    throw ApiError.notFound('Contact not found');
  }
  return contact;
}

async function createContact(adminUser, payload) {
  const contact = await Contact.create({
    ...payload,
    ownerId: adminUser._id,
    deletedAt: null,
  });
  return contact;
}

async function updateContact(adminUser, contactId, payload) {
  const contact = await getContact(adminUser, contactId);

  const updatable = [
    'type',
    'organizationName',
    'userId',
    'organizationId',
    'organizationType',
    'country',
    'city',
    'contactName',
    'contactRole',
    'phone',
    'whatsapp',
    'email',
    'socialLinks',
    'relationshipStatus',
    'tags',
    'privateNotes',
  ];

  updatable.forEach((field) => {
    if (payload[field] !== undefined) {
      contact[field] = payload[field];
    }
  });

  await contact.save();
  return contact;
}

async function softDeleteContact(adminUser, contactId) {
  const contact = await getContact(adminUser, contactId);
  contact.deletedAt = new Date();
  await contact.save();
  return contact;
}

// --- Interactions ---

async function listInteractions(adminUser, contactId) {
  // Verifie que le contact appartient bien a l'admin
  await getContact(adminUser, contactId);

  return Interaction.find({
    contactId,
    ownerId: adminUser._id,
  })
    .sort({ occurredAt: -1 })
    .limit(500);
}

async function createInteraction(adminUser, contactId, payload) {
  await getContact(adminUser, contactId);

  const interaction = await Interaction.create({
    contactId,
    ownerId: adminUser._id,
    type: payload.type || 'NOTE',
    summary: payload.summary,
    details: payload.details || '',
    occurredAt: payload.occurredAt ? new Date(payload.occurredAt) : new Date(),
  });

  return interaction;
}

async function deleteInteraction(adminUser, contactId, interactionId) {
  await getContact(adminUser, contactId);

  const interaction = await Interaction.findOneAndDelete({
    _id: interactionId,
    contactId,
    ownerId: adminUser._id,
  });

  if (!interaction) {
    throw ApiError.notFound('Interaction not found');
  }

  return interaction;
}

module.exports = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  softDeleteContact,
  listInteractions,
  createInteraction,
  deleteInteraction,
};