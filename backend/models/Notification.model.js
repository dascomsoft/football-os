const mongoose = require('mongoose');

const TYPES = [
  'SIGNUP_RECEIVED',
  'REQUEST_RECEIVED',
  'REQUEST_APPROVED',
  'REQUEST_REJECTED',
  'REQUEST_INFO',
  'PROPOSAL_RECEIVED',
  'PROPOSAL_RESPONSE',
];

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    relatedType: {
      type: String,
      trim: true,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

notificationSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);

module.exports = Notification;
module.exports.TYPES = TYPES;