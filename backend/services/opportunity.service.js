const Opportunity = require('../models/Opportunity.model');
const RecruitmentRequest = require('../models/RecruitmentRequest.model');
const ApiError = require('../utils/ApiError');

const ALLOWED_TRANSITIONS = {
  PENDING: ['APPROVED', 'REJECTED', 'REQUESTED_INFO'],
  REQUESTED_INFO: ['APPROVED', 'REJECTED'],
  APPROVED: [],
  REJECTED: [],
  CANCELLED: [],
};

const REASON_REQUIRED = ['REJECTED', 'REQUESTED_INFO'];

const ALLOWED_TYPES_BY_ROLE = {
  ACADEMY: ['PLAYER'],
  CLUB: ['PLAYER', 'COACH'],
  COACH: ['COACH'],
};

const PUBLIC_VISIBILITIES = ['NETWORK', 'PROFESSIONAL'];

async function generateReference(type) {
  const base = await Opportunity.countDocuments({ type });
  let n = base + 1;
  let attempts = 0;

  while (attempts < 100) {
    const candidate = `${type}-${String(n).padStart(3, '0')}`;
    const exists = await Opportunity.findOne({ reference: candidate });
    if (!exists) return candidate;
    n += 1;
    attempts += 1;
  }

  throw ApiError.conflict('Could not generate a unique opportunity reference');
}

function buildCriteriaFromRequest(request) {
  if (request.type === 'PLAYER') {
    return request.playerCriteria
      ? request.playerCriteria.toObject?.() || request.playerCriteria
      : {};
  }
  return request.coachCriteria
    ? request.coachCriteria.toObject?.() || request.coachCriteria
    : {};
}

function inferCategory(request) {
  if (request.type === 'PLAYER') return 'RECRUITMENT';
  if (request.coachCriteria?.role) return request.coachCriteria.role;
  return 'OTHER';
}

async function listRequestsForAdmin(filters = {}) {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.country) query.country = filters.country;

  return RecruitmentRequest.find(query).sort({ createdAt: -1 }).limit(500);
}

async function getRequestForAdmin(requestId) {
  const request = await RecruitmentRequest.findById(requestId);
  if (!request) {
    throw ApiError.notFound('Recruitment request not found');
  }
  return request;
}

async function approveRequest(requestId, adminUser, options = {}) {
  const request = await getRequestForAdmin(requestId);

  const allowed = ALLOWED_TRANSITIONS[request.status] || [];
  if (!allowed.includes('APPROVED')) {
    throw ApiError.badRequest(
      `Cannot transition from ${request.status} to APPROVED`
    );
  }

  const visibility = options.visibility || 'NETWORK';
  const allowedVis = ['ADMIN_ONLY', 'PARTNER', 'NETWORK', 'PROFESSIONAL'];
  if (!allowedVis.includes(visibility)) {
    throw ApiError.badRequest(`Invalid visibility: ${visibility}`);
  }

  const reference = await generateReference(request.type);
  const criteria = buildCriteriaFromRequest(request);

  const opportunity = await Opportunity.create({
    reference,
    type: request.type,
    category: inferCategory(request),
    title: request.title,
    country: request.country,
    city: request.city || '',
    level: request.level || 'PROFESSIONAL',
    description: request.description || '',
    criteria,
    deadline: request.deadline || null,
    status: 'ACTIVE',
    visibility,
    sourceRequestId: request._id,
    issuingOrganizationId: request.issuerOrganizationId,
    issuingOrganizationType: request.issuerRole,
    privateNotes: options.privateNotes || '',
  });

  request.status = 'APPROVED';
  request.statusReason = '';
  request.convertedOpportunityId = opportunity._id;
  request.decidedAt = new Date();
  request.decidedBy = adminUser._id;
  await request.save();

  return { request, opportunity };
}

async function rejectRequest(requestId, adminUser, reason) {
  if (!reason || !reason.trim()) {
    throw ApiError.badRequest('Reason is required to reject a request');
  }

  const request = await getRequestForAdmin(requestId);
  const allowed = ALLOWED_TRANSITIONS[request.status] || [];
  if (!allowed.includes('REJECTED')) {
    throw ApiError.badRequest(
      `Cannot transition from ${request.status} to REJECTED`
    );
  }

  request.status = 'REJECTED';
  request.statusReason = reason.trim();
  request.decidedAt = new Date();
  request.decidedBy = adminUser._id;
  await request.save();

  return request;
}

async function requestInfoRequest(requestId, adminUser, reason) {
  if (!reason || !reason.trim()) {
    throw ApiError.badRequest('Reason is required to request information');
  }

  const request = await getRequestForAdmin(requestId);
  const allowed = ALLOWED_TRANSITIONS[request.status] || [];
  if (!allowed.includes('REQUESTED_INFO')) {
    throw ApiError.badRequest(
      `Cannot transition from ${request.status} to REQUESTED_INFO`
    );
  }

  request.status = 'REQUESTED_INFO';
  request.statusReason = reason.trim();
  request.decidedAt = new Date();
  request.decidedBy = adminUser._id;
  await request.save();

  return request;
}

async function listPublicOpportunities(user, filters = {}) {
  const allowedTypes = ALLOWED_TYPES_BY_ROLE[user.role];
  if (!allowedTypes) {
    throw ApiError.forbidden('Role not allowed to browse opportunities');
  }

  const query = {
    status: 'ACTIVE',
    visibility: { $in: PUBLIC_VISIBILITIES },
    type: { $in: allowedTypes },
  };

  if (filters.type && allowedTypes.includes(filters.type)) {
    query.type = filters.type;
  }
  if (filters.country) query.country = filters.country;
  if (filters.level) query.level = filters.level;

  return Opportunity.find(query).sort({ createdAt: -1 }).limit(500);
}

async function getPublicOpportunity(user, opportunityId) {
  const allowedTypes = ALLOWED_TYPES_BY_ROLE[user.role];
  if (!allowedTypes) {
    throw ApiError.forbidden('Role not allowed to browse opportunities');
  }

  const opp = await Opportunity.findById(opportunityId);
  if (!opp) {
    throw ApiError.notFound('Opportunity not found');
  }
  if (opp.status !== 'ACTIVE') {
    throw ApiError.notFound('Opportunity not found');
  }
  if (!PUBLIC_VISIBILITIES.includes(opp.visibility)) {
    throw ApiError.notFound('Opportunity not found');
  }
  if (!allowedTypes.includes(opp.type)) {
    throw ApiError.forbidden('Role not allowed to view this opportunity type');
  }
  return opp;
}




async function listAllOpportunitiesForAdmin(filters = {}) {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.type) query.type = filters.type;
  if (filters.visibility) query.visibility = filters.visibility;

  return Opportunity.find(query).sort({ createdAt: -1 }).limit(1000);
}









module.exports = {
  listRequestsForAdmin,
  getRequestForAdmin,
  approveRequest,
  rejectRequest,
  requestInfoRequest,
  generateReference,
  listPublicOpportunities,
  getPublicOpportunity,
  listAllOpportunitiesForAdmin,
};