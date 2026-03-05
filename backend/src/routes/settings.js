const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// System Settings (Admin, Central Manager only)
router.get('/system', authorize('Admin', 'Central Manager'), settingsController.getSystemSettings);
router.put('/system/:key', authorize('Admin', 'Central Manager'), settingsController.updateSystemSetting);
router.post('/system', authorize('Admin', 'Central Manager'), settingsController.createSystemSetting);

// Asset Categories
router.get('/categories', settingsController.getAssetCategories);
router.get('/categories/:id', settingsController.getAssetCategoryById);
router.post('/categories', authorize('Admin', 'Central Manager'), settingsController.createAssetCategory);
router.put('/categories/:id', authorize('Admin', 'Central Manager'), settingsController.updateAssetCategory);
router.delete('/categories/:id', authorize('Admin', 'Central Manager'), settingsController.deleteAssetCategory);

// Measurement Units
router.get('/measurement-units', settingsController.getMeasurementUnits);
router.get('/measurement-units/:id', settingsController.getMeasurementUnitById);
router.post('/measurement-units', authorize('Admin', 'Central Manager'), settingsController.createMeasurementUnit);
router.put('/measurement-units/:id', authorize('Admin', 'Central Manager'), settingsController.updateMeasurementUnit);
router.delete('/measurement-units/:id', authorize('Admin', 'Central Manager'), settingsController.deleteMeasurementUnit);

// Energy Types
router.get('/energy-types', settingsController.getEnergyTypes);
router.get('/energy-types/:id', settingsController.getEnergyTypeById);
router.post('/energy-types', authorize('Admin', 'Central Manager'), settingsController.createEnergyType);
router.put('/energy-types/:id', authorize('Admin', 'Central Manager'), settingsController.updateEnergyType);
router.delete('/energy-types/:id', authorize('Admin', 'Central Manager'), settingsController.deleteEnergyType);

// Authorized Departments
router.get('/departments', settingsController.getAuthorizedDepartments);
router.get('/departments/:id', settingsController.getAuthorizedDepartmentById);
router.post('/departments', authorize('Admin', 'Central Manager'), settingsController.createAuthorizedDepartment);
router.put('/departments/:id', authorize('Admin', 'Central Manager'), settingsController.updateAuthorizedDepartment);
router.delete('/departments/:id', authorize('Admin', 'Central Manager'), settingsController.deleteAuthorizedDepartment);

// Maintenance Types
router.get('/maintenance-types', settingsController.getMaintenanceTypes);
router.get('/maintenance-types/:id', settingsController.getMaintenanceTypeById);
router.post('/maintenance-types', authorize('Admin', 'Central Manager'), settingsController.createMaintenanceType);
router.put('/maintenance-types/:id', authorize('Admin', 'Central Manager'), settingsController.updateMaintenanceType);
router.delete('/maintenance-types/:id', authorize('Admin', 'Central Manager'), settingsController.deleteMaintenanceType);

module.exports = router;
