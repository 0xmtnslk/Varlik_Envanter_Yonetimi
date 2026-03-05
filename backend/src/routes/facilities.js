const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { auth, authorize, checkFacilityAccess } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all facilities
router.get('/', facilityController.getAllFacilities);

// Get facility by ID
router.get('/:id', facilityController.getFacilityById);

// Create facility (Admin, Central Manager)
router.post('/', authorize('Admin', 'Central Manager'), facilityController.createFacility);

// Update facility (Admin, Central Manager, Hospital Manager)
router.put('/:id', authorize('Admin', 'Central Manager', 'Hospital Manager'), facilityController.updateFacility);

// Delete facility (Admin, Central Manager)
router.delete('/:id', authorize('Admin', 'Central Manager'), facilityController.deleteFacility);

// Get facility blocks
router.get('/:id/blocks', facilityController.getFacilityBlocks);

// Add block to facility
router.post('/:id/blocks', authorize('Admin', 'Central Manager', 'Hospital Manager'), facilityController.addBlock);

// Update block
router.put('/:id/blocks/:blockId', authorize('Admin', 'Central Manager', 'Hospital Manager'), facilityController.updateBlock);

// Delete block
router.delete('/:id/blocks/:blockId', authorize('Admin', 'Central Manager', 'Hospital Manager'), facilityController.deleteBlock);

// Get facility statistics
router.get('/:id/statistics', facilityController.getFacilityStatistics);

module.exports = router;
