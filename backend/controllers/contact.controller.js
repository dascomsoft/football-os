const contactService = require('../services/contact.service');

async function listContacts(req, res) {
  const filters = {
    type: req.query.type,
    relationshipStatus: req.query.relationshipStatus,
    country: req.query.country,
    tag: req.query.tag,
    search: req.query.search,
  };

  const items = await contactService.listContacts(req.user, filters);
  res.status(200).json({
    items: items.map((c) => c.toJSON()),
    total: items.length,
  });
}

async function getContact(req, res) {
  const contact = await contactService.getContact(req.user, req.params.id);
  res.status(200).json({ contact: contact.toJSON() });
}

async function createContact(req, res) {
  const contact = await contactService.createContact(req.user, req.body);
  res.status(201).json({ contact: contact.toJSON() });
}

async function updateContact(req, res) {
  const contact = await contactService.updateContact(
    req.user,
    req.params.id,
    req.body
  );
  res.status(200).json({ contact: contact.toJSON() });
}

async function deleteContact(req, res) {
  const contact = await contactService.softDeleteContact(req.user, req.params.id);
  res.status(200).json({ contact: contact.toJSON() });
}

async function listInteractions(req, res) {
  const items = await contactService.listInteractions(req.user, req.params.id);
  res.status(200).json({
    items: items.map((i) => i.toJSON()),
    total: items.length,
  });
}

async function createInteraction(req, res) {
  const interaction = await contactService.createInteraction(
    req.user,
    req.params.contactId,
    req.body
  );
  res.status(201).json({ interaction: interaction.toJSON() });
}

async function deleteInteraction(req, res) {
  await contactService.deleteInteraction(
    req.user,
    req.params.contactId,
    req.params.id
  );
  res.status(200).json({ message: 'Interaction deleted' });
}

module.exports = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  listInteractions,
  createInteraction,
  deleteInteraction,
};