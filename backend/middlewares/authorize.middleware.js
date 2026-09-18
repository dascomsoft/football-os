const ApiError = require('../utils/ApiError');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient role'));
    }
    return next();
  };
}

function requireApproved() {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (req.user.status !== 'APPROVED') {
      return next(ApiError.forbidden('Account not approved'));
    }
    return next();
  };
}

module.exports = { authorize, requireApproved };