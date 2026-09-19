const mongoose = require('mongoose');

const STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REQUESTED_INFO',
  'SUSPENDED',
  'BLOCKED',
];

const academySchema = new mongoose.Schema(
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

academySchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Academy = mongoose.model('Academy', academySchema);

module.exports = Academy;
module.exports.STATUSES = STATUSES;