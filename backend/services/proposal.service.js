const Proposal = require('../models/Proposal.model');
const Opportunity = require('../models/Opportunity.model');
const Player = require('../models/Player.model');
const Coach = require('../models/Coach.model');
const Academy = require('../models/Academy.model');
const Club = require('../models/Club.model');
const ApiError = require('../utils/ApiError');

const ALLOWED_TRANSITIONS = {
  DRAFT: ['SENT', 'CLOSED'],
  SENT: ['VIEWED', 'INTERESTED', 'DECLINED', 'CLOSED'],
  VIEWED: ['INTERESTED', 'DECLINED', 'CLOSED'],
  INTERESTED: ['CLOSED'],
  DECLINED: ['CLOSED'],
  CLOSED: [],
};

const REASON_REQUIRED = ['DECLINED', 'CLOSED'];

async function generateReference() {
  const count = await Proposal.countDocuments();
  let n = count + 1;
  let attempts = 0;

  while (attempts < 100) {
    const candidate = `PROP-${String(n).padStart(3, '0')}`;
    const exists = await Proposal.findOne({ reference: candidate });
    if (!exists) return candidate;
    n += 1;
    attempts += 1;
  }

  throw ApiError.conflict('Could not generate a unique proposal reference');
}

async function resolveCandidate(candidateType, candidateId) {
  if (candidateType === 'PLAYER') {
    const player = await Player.findById(candidateId);
    if (!player) throw ApiError.notFound('Player not found');
    return { candidate: player, academyId: player.academyId };
  }

  if (candidateType === 'COACH') {
    const coach = await Coach.findById(candidateId);
    if (!coach) throw ApiError.notFound('Coach not found');
    return { candidate: coach, academyId: null };
  }

  throw ApiError.badRequest(`Invalid candidateType: ${candidateType}`);
}

async function createProposal(adminUser, payload) {
  const { opportunityId, clubId, candidateType, candidateId, message, sharedVideos } = payload;

  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) throw ApiError.notFound('Opportunity not found');
  if (opportunity.status !== 'ACTIVE') {
    throw ApiError.badRequest('Opportunity is not active');
  }

  if (opportunity.type !== candidateType) {
    throw ApiError.badRequest(
      `Opportunity type is ${opportunity.type}, candidate type is ${candidateType}`
    );
  }

  const club = await Club.findById(clubId);
  if (!club) throw ApiError.notFound('Club not found');
  if (club.status !== 'APPROVED') {
    throw ApiError.badRequest('Club is not approved');
  }

  const { academyId } = await resolveCandidate(candidateType, candidateId);

  const existing = await Proposal.findOne({ opportunityId, candidateId });
  if (existing) {
    throw ApiError.conflict('This candidate has already been proposed for this opportunity');
  }

  const reference = await generateReference();

  const proposal = await Proposal.create({
    reference,
    opportunityId,
    clubId,
    candidateType,
    candidateId,
    academyId,
    adminId: adminUser._id,
    message: message || '',
    sharedVideos: Array.isArray(sharedVideos) ? sharedVideos : [],
    status: 'DRAFT',
  });

  return proposal;
}

async function sendProposal(adminUser, proposalId) {
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) throw ApiError.notFound('Proposal not found');

  const allowed = ALLOWED_TRANSITIONS[proposal.status] || [];
  if (!allowed.includes('SENT')) {
    throw ApiError.badRequest(`Cannot transition from ${proposal.status} to SENT`);
  }

  proposal.status = 'SENT';
  proposal.sentAt = new Date();
  await proposal.save();
  return proposal;
}

async function closeProposal(adminUser, proposalId, reason) {
  if (!reason || !reason.trim()) {
    throw ApiError.badRequest('Reason is required to close a proposal');
  }

  const proposal = await Proposal.findById(proposalId);
  if (!proposal) throw ApiError.notFound('Proposal not found');

  const allowed = ALLOWED_TRANSITIONS[proposal.status] || [];
  if (!allowed.includes('CLOSED')) {
    throw ApiError.badRequest(`Cannot transition from ${proposal.status} to CLOSED`);
  }

  proposal.status = 'CLOSED';
  proposal.statusReason = reason.trim();
  await proposal.save();
  return proposal;
}

async function listProposalsForAdmin(filters = {}) {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.opportunityId) query.opportunityId = filters.opportunityId;
  if (filters.clubId) query.clubId = filters.clubId;
  if (filters.candidateType) query.candidateType = filters.candidateType;

  return Proposal.find(query).sort({ createdAt: -1 }).limit(500);
}

async function getProposalForAdmin(proposalId) {
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) throw ApiError.notFound('Proposal not found');
  return proposal;
}

async function getProposalForClub(clubUser, proposalId) {
  const club = await Club.findOne({ userId: clubUser._id });
  if (!club) throw ApiError.forbidden('No club profile attached to this account');

  const proposal = await Proposal.findOne({
    _id: proposalId,
    clubId: club._id,
  });
  if (!proposal) throw ApiError.notFound('Proposal not found');
  return proposal;
}

async function listProposalsForClub(clubUser, filters = {}) {
  const club = await Club.findOne({ userId: clubUser._id });
  if (!club) throw ApiError.forbidden('No club profile attached to this account');

  const query = { clubId: club._id };
  if (filters.status) query.status = filters.status;

  return Proposal.find(query).sort({ createdAt: -1 }).limit(500);
}

async function markViewed(clubUser, proposalId) {
  const proposal = await getProposalForClub(clubUser, proposalId);

  if (proposal.status === 'SENT') {
    proposal.status = 'VIEWED';
    proposal.viewedAt = new Date();
    await proposal.save();
  }

  return proposal;
}

async function markInterested(clubUser, proposalId, response) {
  const proposal = await getProposalForClub(clubUser, proposalId);

  const allowed = ALLOWED_TRANSITIONS[proposal.status] || [];
  if (!allowed.includes('INTERESTED')) {
    throw ApiError.badRequest(
      `Cannot transition from ${proposal.status} to INTERESTED`
    );
  }

  proposal.status = 'INTERESTED';
  if (response) proposal.clubResponse = response.trim();
  proposal.respondedAt = new Date();
  await proposal.save();
  return proposal;
}

async function markDeclined(clubUser, proposalId, reason) {
  if (!reason || !reason.trim()) {
    throw ApiError.badRequest('Reason is required to decline a proposal');
  }

  const proposal = await getProposalForClub(clubUser, proposalId);

  const allowed = ALLOWED_TRANSITIONS[proposal.status] || [];
  if (!allowed.includes('DECLINED')) {
    throw ApiError.badRequest(
      `Cannot transition from ${proposal.status} to DECLINED`
    );
  }

  proposal.status = 'DECLINED';
  proposal.statusReason = reason.trim();
  proposal.respondedAt = new Date();
  await proposal.save();
  return proposal;
}

// Donnees sportives du candidat, sans aucune donnee privee
async function buildCandidateView(proposal) {
  if (proposal.candidateType === 'PLAYER') {
    const player = await Player.findById(proposal.candidateId).lean();
    if (!player) return null;

    const now = new Date();
    const dob = new Date(player.dateOfBirth);
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age -= 1;
    }

    return {
      type: 'PLAYER',
      firstName: player.firstName,
      lastName: player.lastName,
      age,
      nationality: player.nationality,
      gender: player.gender,
      position: player.position,
      secondaryPosition: player.secondaryPosition,
      preferredFoot: player.preferredFoot,
      height: player.height,
      weight: player.weight,
      experienceYears: player.experienceYears,
      currentClub: player.currentClub,
      photoUrl: player.photoUrl,
    };
  }

  const coach = await Coach.findById(proposal.candidateId).lean();
  if (!coach) return null;

  return {
    type: 'COACH',
    firstName: coach.firstName,
    lastName: coach.lastName,
    nationality: coach.nationality,
    countryOfResidence: coach.countryOfResidence,
    city: coach.city,
    languages: coach.languages,
    primaryRole: coach.primaryRole,
    secondaryRole: coach.secondaryRole,
    yearsOfExperience: coach.yearsOfExperience,
    licenses: coach.licenses,
    diplomas: coach.diplomas,
    specializations: coach.specializations,
    philosophy: coach.philosophy,
    competitions: coach.competitions,
    achievements: coach.achievements,
    availability: coach.availability,
  };
}

// Vues enrichies : proposal + candidate + opportunity (filtree)
async function buildAdminProposalView(proposal) {
  const candidate = await buildCandidateView(proposal);
  const opportunity = await Opportunity.findById(proposal.opportunityId).lean();

  return {
    proposal: proposal.toAdminJSON(),
    candidate,
    opportunity: opportunity
      ? {
          _id: opportunity._id,
          reference: opportunity.reference,
          type: opportunity.type,
          title: opportunity.title,
          country: opportunity.country,
          city: opportunity.city,
          level: opportunity.level,
          status: opportunity.status,
        }
      : null,
  };
}

async function buildClubProposalView(proposal) {
  const candidate = await buildCandidateView(proposal);
  const opportunity = await Opportunity.findById(proposal.opportunityId).lean();

  return {
    proposal: proposal.toClubJSON(),
    candidate,
    opportunity: opportunity
      ? {
          _id: opportunity._id,
          reference: opportunity.reference,
          type: opportunity.type,
          title: opportunity.title,
          country: opportunity.country,
          level: opportunity.level,
          status: opportunity.status,
        }
      : null,
  };
}

module.exports = {
  createProposal,
  sendProposal,
  closeProposal,
  listProposalsForAdmin,
  getProposalForAdmin,
  listProposalsForClub,
  getProposalForClub,
  markViewed,
  markInterested,
  markDeclined,
  buildAdminProposalView,
  buildClubProposalView,
  buildCandidateView,
};