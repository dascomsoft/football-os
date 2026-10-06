const mongoose = require('mongoose');

const TYPES = [
  'CLUB',
  'ACADEMY',
  'SCOUT',
  'AGENT',
  'COACH',
  'SPORTING_DIRECTOR',
  'RECRUITER',
  'OTHER',
];

const ORGANIZATION_TYPES = ['CLUB', 'ACADEMY', 'COACH', ''];

const RELATIONSHIP_STATUSES = ['PROSPECT', 'ACTIVE', 'INACTIVE', 'CLOSED'];

const socialLinksSchema = new mongoose.Schema(
  {
    linkedin: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    ownerId: {
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
    organizationName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    organizationType: {
      type: String,
      enum: ORGANIZATION_TYPES,
      default: '',
    },

    country: { type: String, trim: true, default: '', index: true },
    city: { type: String, trim: true, default: '' },

    contactName: { type: String, trim: true, default: '' },
    contactRole: { type: String, trim: true, default: '' },

    phone: { type: String, trim: true, default: '' },
    whatsapp: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },

    socialLinks: { type: socialLinksSchema, default: () => ({}) },

    relationshipStatus: {
      type: String,
      enum: RELATIONSHIP_STATUSES,
      default: 'PROSPECT',
      index: true,
    },

    tags: { type: [String], default: [] },

    privateNotes: { type: String, trim: true, default: '', maxlength: 10000 },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

contactSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
module.exports = Contact;
module.exports.TYPES = TYPES;
module.exports.ORGANIZATION_TYPES = ORGANIZATION_TYPES;
module.exports.RELATIONSHIP_STATUSES = RELATIONSHIP_STATUSES;