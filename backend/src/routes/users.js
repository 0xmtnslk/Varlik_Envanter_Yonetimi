const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all users (Admin, Manager, Hospital Manager, Central Manager)
router.get('/', authorize('Admin', 'Manager', 'Hospital Manager', 'Central Manager'), userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', authorize('Admin', 'Manager', 'Hospital Manager', 'Central Manager'), userController.updateUser);

// Delete user (Admin only)
router.delete('/:id', authorize('Admin'), userController.deleteUser);

// Assign role to user
router.post('/:id/roles', authorize('Admin', 'Hospital Manager', 'Central Manager'), userController.assignRole);

// Remove role from user
router.delete('/:id/roles/:roleId', authorize('Admin', 'Hospital Manager', 'Central Manager'), userController.removeRole);

// Sync users from Oracle
router.post('/sync/oracle', authorize('Admin'), userController.syncFromOracle);

module.exports = router;
