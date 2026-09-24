const mongoose = require('mongoose');

const CANDIDATE_TYPES = ['PLAYER', 'COACH'];

const STATUSES = [
  'DRAFT',
  'SENT',
  'VIEWED',
  'INTERESTED',
  'DECLINED',
  'CLOSED',
];

const ALLOWED_TRANSITIONS = {
  DRAFT: ['SENT', 'CLOSED'],
  SENT: ['VIEWED', 'INTERESTED', 'DECLINED', 'CLOSED'],
  VIEWED: ['INTERESTED', 'DECLINED', 'CLOSED'],
  INTERESTED: ['CLOSED'],
  DECLINED: ['CLOSED'],
  CLOSED: [],
};

const REASON_REQUIRED = ['DECLINED', 'CLOSED'];

const proposalSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
      index: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
      index: true,
    },

    candidateType: {
      type: String,
      enum: CANDIDATE_TYPES,
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // academyId est renseigne uniquement si candidateType = PLAYER
    academyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Academy',
      default: null,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: 4000,
    },

    sharedVideos: {
      type: [
        {
          url: { type: String, required: true, trim: true },
          title: { type: String, trim: true, default: '' },
          type: {
            type: String,
            enum: ['HIGHLIGHTS', 'FULL_MATCH', 'TRAINING', 'SKILLS', 'OTHER'],
            default: 'HIGHLIGHTS',
          },
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: STATUSES,
      default: 'DRAFT',
      index: true,
    },
    statusReason: {
      type: String,
      trim: true,
      default: '',
    },

    clubResponse: {
      type: String,
      trim: true,
      default: '',
      maxlength: 4000,
    },

    sentAt: { type: Date, default: null },
    viewedAt: { type: Date, default: null },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Un seul proposal par (opportunite, candidat)
proposalSchema.index({ opportunityId: 1, candidateId: 1 }, { unique: true });

proposalSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// Vue complete pour l'ADMIN
proposalSchema.methods.toAdminJSON = function toAdminJSON() {
  return this.toJSON();
};

// Vue filtree pour le CLUB destinataire
proposalSchema.methods.toClubJSON = function toClubJSON() {
  const obj = this.toJSON();

  // Champs jamais exposes au club
  delete obj.adminId;
  delete obj.academyId;
  delete obj.statusReason;

  return obj;
};

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
module.exports.CANDIDATE_TYPES = CANDIDATE_TYPES;
module.exports.STATUSES = STATUSES;
module.exports.ALLOWED_TRANSITIONS = ALLOWED_TRANSITIONS;
module.exports.REASON_REQUIRED = REASON_REQUIRED;