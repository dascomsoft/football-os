const mongoose = require('mongoose');

const TYPES = ['PLAYER', 'COACH'];

const ISSUER_ROLES = ['CLUB', 'COACH', 'ACADEMY'];

const LEVELS = ['AMATEUR', 'SEMI_PRO', 'PROFESSIONAL', 'ELITE'];

const STATUSES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'REQUESTED_INFO',
  'CANCELLED',
];

const POSITIONS = [
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
  'CDM', 'CM', 'CAM', 'LM', 'RM',
  'LW', 'RW', 'CF', 'ST',
];

const FEET = ['LEFT', 'RIGHT', 'BOTH'];

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

const playerCriteriaSchema = new mongoose.Schema(
  {
    position: { type: String, enum: [...POSITIONS, ''] },
    secondaryPosition: { type: String, enum: [...POSITIONS, ''] },
    ageMin: { type: Number, min: 10, max: 50 },
    ageMax: { type: Number, min: 10, max: 50 },
    nationality: { type: String, trim: true },
    preferredFoot: { type: String, enum: [...FEET, ''] },
    heightMin: { type: Number, min: 120, max: 220 },
    experienceMin: { type: Number, min: 0, max: 30 },
  },
  { _id: false }
);

const coachCriteriaSchema = new mongoose.Schema(
  {
    role: { type: String, enum: [...COACH_ROLES, ''] },
    license: { type: String, trim: true },
    experienceMin: { type: Number, min: 0, max: 40 },
    language: { type: [String], default: [] },
    category: { type: String, trim: true },
  },
  { _id: false }
);

const recruitmentRequestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: TYPES,
      required: true,
      index: true,
    },
    issuerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    issuerRole: {
      type: String,
      enum: ISSUER_ROLES,
      required: true,
      index: true,
    },
    issuerOrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 160 },
    country: { type: String, required: true, trim: true, index: true },
    city: { type: String, trim: true, default: '' },
    level: { type: String, enum: LEVELS, default: 'PROFESSIONAL' },
    description: { type: String, trim: true, default: '', maxlength: 4000 },
    deadline: { type: Date, default: null, index: true },

    playerCriteria: {
      type: playerCriteriaSchema,
      default: () => ({}),
    },
    coachCriteria: {
      type: coachCriteriaSchema,
      default: () => ({}),
    },

    status: {
      type: String,
      enum: STATUSES,
      default: 'PENDING',
      index: true,
    },
    statusReason: { type: String, trim: true, default: '' },

    convertedOpportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      default: null,
    },

    decidedAt: { type: Date, default: null },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

recruitmentRequestSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const RecruitmentRequest = mongoose.model(
  'RecruitmentRequest',
  recruitmentRequestSchema
);

module.exports = RecruitmentRequest;
module.exports.TYPES = TYPES;
module.exports.ISSUER_ROLES = ISSUER_ROLES;
module.exports.LEVELS = LEVELS;
module.exports.STATUSES = STATUSES;
module.exports.POSITIONS = POSITIONS;
module.exports.FEET = FEET;
module.exports.COACH_ROLES = COACH_ROLES;