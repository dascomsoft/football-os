const Notification = require('../models/Notification.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');

async function createNotification({ recipientId, type, title, message, relatedId, relatedType }) {
  if (!recipientId) return null;
  return Notification.create({
    recipientId,
    type,
    title,
    message: message || '',
    relatedId: relatedId || null,
    relatedType: relatedType || '',
  });
}

async function notifyPrimaryAdmin(payload) {
  const admin = await User.findOne({
    role: 'ADMIN',
    status: 'APPROVED',
  }).sort({ createdAt: 1 });

  if (!admin) return null;

  return createNotification({
    recipientId: admin._id,
    ...payload,
  });
}

async function listForUser(user, filters = {}) {
  const query = { recipientId: user._id };
  if (filters.unreadOnly) query.read = false;

  return Notification.find(query).sort({ createdAt: -1 }).limit(200);
}

async function unreadCount(user) {
  return Notification.countDocuments({
    recipientId: user._id,
    read: false,
  });
}

async function markAsRead(user, notificationId) {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipientId: user._id,
  });
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }
  if (!notification.read) {
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();
  }
  return notification;
}

async function markAllAsRead(user) {
  const now = new Date();
  const result = await Notification.updateMany(
    { recipientId: user._id, read: false },
    { $set: { read: true, readAt: now } }
  );
  return { updated: result.modifiedCount || 0 };
}

module.exports = {
  createNotification,
  notifyPrimaryAdmin,
  listForUser,
  unreadCount,
  markAsRead,
  markAllAsRead,
};