const mongoose = require('mongoose');

const POSITIONS = [
  'GK',
  'CB',
  'LB',
  'RB',
  'LWB',
  'RWB',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RM',
  'LW',
  'RW',
  'CF',
  'ST',
];

const FEET = ['LEFT', 'RIGHT', 'BOTH'];

const GENDERS = ['MALE', 'FEMALE'];

const STATUSES = ['ACTIVE', 'INACTIVE', 'ARCHIVED'];

const VISIBILITIES = [
  'ADMIN_ONLY',
  'PARTNER',
  'NETWORK',
  'PROFESSIONAL',
  'PRESENTATION',
];

const videoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    title: { type: String, trim: true, default: '' },
    type: {
      type: String,
      enum: ['HIGHLIGHTS', 'FULL_MATCH', 'TRAINING', 'SKILLS', 'OTHER'],
      default: 'HIGHLIGHTS',
    },
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema(
  {
    academyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Academy',
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    firstName: { type: String, required: true, trim: true, index: true },
    lastName: { type: String, required: true, trim: true, index: true },
    dateOfBirth: { type: Date, required: true, index: true },
    nationality: { type: String, required: true, trim: true, index: true },
    gender: { type: String, enum: GENDERS, default: 'MALE' },

    position: {
      type: String,
      enum: POSITIONS,
      required: true,
      index: true,
    },
    secondaryPosition: {
      type: String,
      enum: [...POSITIONS, ''],
      default: '',
    },
    preferredFoot: { type: String, enum: FEET, default: 'RIGHT' },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    experienceYears: { type: Number, default: 0 },
    currentClub: { type: String, trim: true, default: '' },

    photoUrl: { type: String, trim: true, default: '' },
    videos: { type: [videoSchema], default: [] },

    status: {
      type: String,
      enum: STATUSES,
      default: 'ACTIVE',
      index: true,
    },
    visibility: {
      type: String,
      enum: VISIBILITIES,
      default: 'ADMIN_ONLY',
      index: true,
    },
  },
  { timestamps: true }
);

playerSchema.virtual('age').get(function computeAge() {
  if (!this.dateOfBirth) return null;
  const now = new Date();
  const dob = new Date(this.dateOfBirth);
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
});

playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });

// Nettoyage des champs internes jamais destines au client
playerSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toJSON();
  delete obj.__v;
  delete obj.createdBy;
  return obj;
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
module.exports.POSITIONS = POSITIONS;
module.exports.FEET = FEET;
module.exports.STATUSES = STATUSES;
module.exports.VISIBILITIES = VISIBILITIES;