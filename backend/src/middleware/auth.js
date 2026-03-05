const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  // Skip authentication for OPTIONS requests (preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // Skip authorization for OPTIONS requests (preflight)
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const checkFacilityAccess = (req, res, next) => {
  // Skip check for OPTIONS requests
  if (req.method === 'OPTIONS') {
    return next();
  }

  const facilityId = req.params.facilityId || req.body.facilityId;
  
  if (!facilityId) {
    return res.status(400).json({ error: 'Facility ID required' });
  }
  
  // Admin and Central Manager can access all facilities
  if (['Admin', 'Central Manager'].includes(req.user.role)) {
    return next();
  }
  
  // Check if user has access to this facility
  if (req.user.facilities && !req.user.facilities.includes(facilityId)) {
    return res.status(403).json({ error: 'No access to this facility' });
  }
  
  next();
};

module.exports = { auth, authorize, checkFacilityAccess };
