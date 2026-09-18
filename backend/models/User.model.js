const mongoose = require('mongoose');

const ROLES = ['ADMIN', 'ACADEMY', 'CLUB', 'COACH', 'PLAYER'];

const STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REQUESTED_INFO',
  'SUSPENDED',
  'BLOCKED',
];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'PENDING',
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject({ virtuals: false });
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

userSchema.methods.isActive = function isActive() {
  return this.status === 'APPROVED';
};

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.ROLES = ROLES;
module.exports.STATUSES = STATUSES;