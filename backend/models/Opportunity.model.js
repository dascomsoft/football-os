const mongoose = require('mongoose');

const TYPES = ['PLAYER', 'COACH'];

const STATUSES = ['DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED'];

const VISIBILITIES = [
  'ADMIN_ONLY',
  'PARTNER',
  'NETWORK',
  'PROFESSIONAL',
];

const ISSUING_TYPES = ['CLUB', 'COACH', 'ACADEMY'];

const PLAYER_CATEGORIES = [
  'TRIAL',
  'RECRUITMENT',
  'SHOWCASE',
  'CAMP',
  'SCHOLARSHIP',
];

const COACH_CATEGORIES = [
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

const opportunitySchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: TYPES,
      required: true,
      index: true,
    },
    category: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
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
    level: {
      type: String,
      default: 'PROFESSIONAL',
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 4000,
    },
    criteria: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: STATUSES,
      default: 'ACTIVE',
      index: true,
    },
    visibility: {
      type: String,
      enum: VISIBILITIES,
      default: 'NETWORK',
      index: true,
    },

    // Champs prives - jamais exposes aux roles non-admin
    sourceRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruitmentRequest',
      default: null,
    },
    issuingOrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    issuingOrganizationType: {
      type: String,
      enum: [...ISSUING_TYPES, ''],
      default: '',
    },
    privateNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

opportunitySchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

opportunitySchema.methods.toAdminJSON = function toAdminJSON() {
  const obj = this.toJSON();
  return obj;
};

opportunitySchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toJSON();
  const isNetwork = this.visibility === 'NETWORK';

  const out = {
    _id: obj._id,
    reference: obj.reference,
    type: obj.type,
    category: obj.category,
    title: obj.title,
    country: obj.country,
    level: obj.level,
    description: obj.description,
    criteria: obj.criteria,
    deadline: obj.deadline,
    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };

  // La ville n'est exposee que si la visibilite est PROFESSIONAL
  if (!isNetwork && obj.city) {
    out.city = obj.city;
  }

  return out;
};

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
module.exports.TYPES = TYPES;
module.exports.STATUSES = STATUSES;
module.exports.VISIBILITIES = VISIBILITIES;
module.exports.ISSUING_TYPES = ISSUING_TYPES;
module.exports.PLAYER_CATEGORIES = PLAYER_CATEGORIES;
module.exports.COACH_CATEGORIES = COACH_CATEGORIES;