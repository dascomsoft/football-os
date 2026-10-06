const mongoose = require('mongoose');

const TYPES = [
  'NOTE',
  'CALL',
  'EMAIL',
  'WHATSAPP',
  'MEETING',
  'PROPOSAL_SENT',
  'OFFER_SENT',
  'OTHER',
];

const interactionSchema = new mongoose.Schema(
  {
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: TYPES,
      default: 'NOTE',
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    details: {
      type: String,
      trim: true,
      default: '',
      maxlength: 10000,
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

interactionSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
module.exports.TYPES = TYPES;