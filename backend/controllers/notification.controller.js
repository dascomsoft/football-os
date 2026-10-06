const notificationService = require('../services/notification.service');

async function listNotifications(req, res) {
  const filters = {
    unreadOnly: req.query.unreadOnly === 'true',
  };
  const items = await notificationService.listForUser(req.user, filters);
  res.status(200).json({
    items: items.map((n) => n.toJSON()),
    total: items.length,
  });
}

async function unreadCount(req, res) {
  const count = await notificationService.unreadCount(req.user);
  res.status(200).json({ count });
}

async function markRead(req, res) {
  const notification = await notificationService.markAsRead(
    req.user,
    req.params.id
  );
  res.status(200).json({ notification: notification.toJSON() });
}

async function markAllRead(req, res) {
  const result = await notificationService.markAllAsRead(req.user);
  res.status(200).json(result);
}

module.exports = {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
};