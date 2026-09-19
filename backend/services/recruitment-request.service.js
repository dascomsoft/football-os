const RecruitmentRequest = require('../models/RecruitmentRequest.model');
const Academy = require('../models/Academy.model');
const Club = require('../models/Club.model');
const Coach = require('../models/Coach.model');
const ApiError = require('../utils/ApiError');

// Detection naive de coordonnees dans les champs libres.
// Empeche un utilisateur de coller un email/telephone pour contourner l'admin.
const CONTACT_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // email
  /\+?\d[\d\s().-]{7,}\d/, // telephone approximatif
  /\b(?:wa\.me|whatsapp|telegram|t\.me)\b/i, // messagerie
  /\bhttps?:\/\/\S+/i, // URL
];

function assertNoContactLeak(text, fieldName) {
  if (!text) return;
  for (const pattern of CONTACT_PATTERNS) {
    if (pattern.test(text)) {
      throw ApiError.badRequest(
        `${fieldName} contains a forbidden contact pattern (email, phone, URL, messaging). ` +
          `All contact must go through the administrator.`
      );
    }
  }
}

async function resolveIssuerOrganization(user) {
  if (user.role === 'CLUB') {
    const club = await Club.findOne({ userId: user._id });
    if (!club) throw ApiError.forbidden('No club profile attached to this account');
    return { role: 'CLUB', organizationId: club._id };
  }

  if (user.role === 'COACH') {
    const coach = await Coach.findOne({ userId: user._id });
    if (!coach) throw ApiError.forbidden('No coach profile attached to this account');
    return { role: 'COACH', organizationId: coach._id };
  }

  throw ApiError.forbidden('Only CLUB and COACH can create recruitment requests');
}

function assertTypeAllowedForRole(type, role) {
  if (role === 'CLUB' && (type === 'PLAYER' || type === 'COACH')) return;
  if (role === 'COACH' && type === 'COACH') return;
  throw ApiError.forbidden(`Role ${role} is not allowed to create a request of type ${type}`);
}

async function createRequest(user, payload) {
  const { role, organizationId } = await resolveIssuerOrganization(user);
  assertTypeAllowedForRole(payload.type, role);

  assertNoContactLeak(payload.title, 'title');
  assertNoContactLeak(payload.description, 'description');
  assertNoContactLeak(payload.country, 'country');
  assertNoContactLeak(payload.city, 'city');

  const doc = {
    type: payload.type,
    issuerUserId: user._id,
    issuerRole: role,
    issuerOrganizationId: organizationId,
    title: payload.title.trim(),
    country: payload.country.trim(),
    city: payload.city ? payload.city.trim() : '',
    level: payload.level || 'PROFESSIONAL',
    description: payload.description ? payload.description.trim() : '',
    deadline: payload.deadline ? new Date(payload.deadline) : null,
    status: 'PENDING',
  };

  if (payload.type === 'PLAYER') {
    doc.playerCriteria = payload.playerCriteria || {};
  } else {
    doc.coachCriteria = payload.coachCriteria || {};
  }

  const request = await RecruitmentRequest.create(doc);
  return request;
}

async function listOwnRequests(user, filters = {}) {
  const query = { issuerUserId: user._id };
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;

  return RecruitmentRequest.find(query).sort({ createdAt: -1 }).limit(500);
}

async function getOwnRequest(user, requestId) {
  const request = await RecruitmentRequest.findOne({
    _id: requestId,
    issuerUserId: user._id,
  });
  if (!request) {
    throw ApiError.notFound('Recruitment request not found');
  }
  return request;
}

async function cancelOwnRequest(user, requestId) {
  const request = await getOwnRequest(user, requestId);
  if (request.status !== 'PENDING') {
    throw ApiError.badRequest('Only PENDING requests can be cancelled');
  }
  request.status = 'CANCELLED';
  await request.save();
  return request;
}

module.exports = {
  createRequest,
  listOwnRequests,
  getOwnRequest,
  cancelOwnRequest,
  assertNoContactLeak,
};