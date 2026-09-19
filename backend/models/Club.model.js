const mongoose = require('mongoose');

const STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REQUESTED_INFO',
  'SUSPENDED',
  'BLOCKED',
];

const clubSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    competition: {
      type: String,
      trim: true,
      default: '',
    },
    foundedYear: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'PENDING',
      index: true,
    },
    statusReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

clubSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
module.exports.STATUSES = STATUSES;