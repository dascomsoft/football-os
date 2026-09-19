const mongoose = require('mongoose');

const STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REQUESTED_INFO',
  'SUSPENDED',
  'BLOCKED',
];

const AVAILABILITY_STATUSES = [
  'UNDER_CONTRACT',
  'AVAILABLE_NOW',
  'AVAILABLE_FROM',
  'OPEN_TO_OFFERS',
  'NOT_AVAILABLE',
];

const COACH_ROLES = [
  'HEAD_COACH',
  'ASSISTANT_COACH',
  'GOALKEEPER_COACH',
  'FITNESS_COACH',
  'YOUTH_COACH',
  'ACADEMY_COACH',
  'TECHNICAL_DIRECTOR',
  'ANALYST',
  'OTHER',
];

const previousClubSchema = new mongoose.Schema(
  {
    clubName: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    from: { type: Date, default: null },
    to: { type: Date, default: null },
  },
  { _id: false }
);

const coachSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    nationality: { type: String, trim: true, default: '', index: true },
    countryOfResidence: { type: String, trim: true, default: '', index: true },
    city: { type: String, trim: true, default: '' },
    languages: { type: [String], default: [] },

    primaryRole: {
      type: String,
      enum: COACH_ROLES,
      required: true,
      index: true,
    },
    secondaryRole: {
      type: String,
      enum: [...COACH_ROLES, ''],
      default: '',
    },
    yearsOfExperience: { type: Number, default: 0, index: true },
    licenses: { type: [String], default: [] },
    diplomas: { type: [String], default: [] },
    specializations: { type: [String], default: [] },
    philosophy: { type: String, trim: true, default: '' },

    previousClubs: { type: [previousClubSchema], default: [] },
    competitions: { type: [String], default: [] },
    achievements: { type: [String], default: [] },

    availability: {
      status: {
        type: String,
        enum: AVAILABILITY_STATUSES,
        default: 'OPEN_TO_OFFERS',
        index: true,
      },
      availableFrom: { type: Date, default: null },
      activelyLooking: { type: Boolean, default: false },
      openToInternational: { type: Boolean, default: false },
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

coachSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
module.exports.STATUSES = STATUSES;
module.exports.COACH_ROLES = COACH_ROLES;
module.exports.AVAILABILITY_STATUSES = AVAILABILITY_STATUSES;