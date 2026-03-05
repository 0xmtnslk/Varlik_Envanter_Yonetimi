const { query } = require('../config/database');

// System Settings
const getSystemSettings = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM system_settings ORDER BY setting_key ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ error: 'Failed to get system settings' });
  }
};

const updateSystemSetting = async (req, res) => {
  try {
    const { setting_value } = req.body;
    
    const result = await query(
      `UPDATE system_settings 
       SET setting_value = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE setting_key = $2
       RETURNING *`,
      [setting_value, req.params.key]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'System setting not found' });
    }
    
    res.json({ message: 'System setting updated', setting: result.rows[0] });
  } catch (error) {
    console.error('Update system setting error:', error);
    res.status(500).json({ error: 'Failed to update system setting' });
  }
};

const createSystemSetting = async (req, res) => {
  try {
    const { setting_key, setting_value, setting_type, description } = req.body;
    
    const result = await query(
      `INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [setting_key, setting_value, setting_type, description]
    );
    
    res.status(201).json({ message: 'System setting created', setting: result.rows[0] });
  } catch (error) {
    console.error('Create system setting error:', error);
    res.status(500).json({ error: 'Failed to create system setting' });
  }
};

// Asset Categories
const getAssetCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT ac.*, 
              (SELECT COUNT(*) FROM assets WHERE category_id = ac.id AND is_active = true) as asset_count
       FROM asset_categories ac
       ORDER BY ac.name ASC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get asset categories error:', error);
    res.status(500).json({ error: 'Failed to get asset categories' });
  }
};

const getAssetCategoryById = async (req, res) => {
  try {
    const result = await query(
      `SELECT ac.*, 
              (SELECT COUNT(*) FROM assets WHERE category_id = ac.id AND is_active = true) as asset_count
       FROM asset_categories ac
       WHERE ac.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get asset category by ID error:', error);
    res.status(500).json({ error: 'Failed to get asset category' });
  }
};

const createAssetCategory = async (req, res) => {
  try {
    const { name, parent_id, category_type, description } = req.body;
    
    const result = await query(
      `INSERT INTO asset_categories (name, parent_id, category_type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, parent_id, category_type, description]
    );
    
    res.status(201).json({ message: 'Asset category created', category: result.rows[0] });
  } catch (error) {
    console.error('Create asset category error:', error);
    res.status(500).json({ error: 'Failed to create asset category' });
  }
};

const updateAssetCategory = async (req, res) => {
  try {
    const { name, parent_id, category_type, description } = req.body;
    
    const result = await query(
      `UPDATE asset_categories 
       SET name = COALESCE($1, name),
           parent_id = COALESCE($2, parent_id),
           category_type = COALESCE($3, category_type),
           description = COALESCE($4, description)
       WHERE id = $5
       RETURNING *`,
      [name, parent_id, category_type, description, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset category not found' });
    }
    
    res.json({ message: 'Asset category updated', category: result.rows[0] });
  } catch (error) {
    console.error('Update asset category error:', error);
    res.status(500).json({ error: 'Failed to update asset category' });
  }
};

const deleteAssetCategory = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM asset_categories WHERE id = $1 AND is_system = false RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset category not found or cannot be deleted' });
    }
    
    res.json({ message: 'Asset category deleted successfully' });
  } catch (error) {
    console.error('Delete asset category error:', error);
    res.status(500).json({ error: 'Failed to delete asset category' });
  }
};

// Measurement Units
const getMeasurementUnits = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM measurement_units ORDER BY unit_type ASC, name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get measurement units error:', error);
    res.status(500).json({ error: 'Failed to get measurement units' });
  }
};

const getMeasurementUnitById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM measurement_units WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Measurement unit not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get measurement unit by ID error:', error);
    res.status(500).json({ error: 'Failed to get measurement unit' });
  }
};

const createMeasurementUnit = async (req, res) => {
  try {
    const { name, symbol, unit_type, description } = req.body;
    
    const result = await query(
      `INSERT INTO measurement_units (name, symbol, unit_type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, symbol, unit_type, description]
    );
    
    res.status(201).json({ message: 'Measurement unit created', unit: result.rows[0] });
  } catch (error) {
    console.error('Create measurement unit error:', error);
    res.status(500).json({ error: 'Failed to create measurement unit' });
  }
};

const updateMeasurementUnit = async (req, res) => {
  try {
    const { name, symbol, unit_type, description } = req.body;
    
    const result = await query(
      `UPDATE measurement_units 
       SET name = COALESCE($1, name),
           symbol = COALESCE($2, symbol),
           unit_type = COALESCE($3, unit_type),
           description = COALESCE($4, description)
       WHERE id = $5
       RETURNING *`,
      [name, symbol, unit_type, description, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Measurement unit not found' });
    }
    
    res.json({ message: 'Measurement unit updated', unit: result.rows[0] });
  } catch (error) {
    console.error('Update measurement unit error:', error);
    res.status(500).json({ error: 'Failed to update measurement unit' });
  }
};

const deleteMeasurementUnit = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM measurement_units WHERE id = $1 AND is_system = false RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Measurement unit not found or cannot be deleted' });
    }
    
    res.json({ message: 'Measurement unit deleted successfully' });
  } catch (error) {
    console.error('Delete measurement unit error:', error);
    res.status(500).json({ error: 'Failed to delete measurement unit' });
  }
};

// Energy Types
const getEnergyTypes = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM energy_types ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get energy types error:', error);
    res.status(500).json({ error: 'Failed to get energy types' });
  }
};

const getEnergyTypeById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM energy_types WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Energy type not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get energy type by ID error:', error);
    res.status(500).json({ error: 'Failed to get energy type' });
  }
};

const createEnergyType = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await query(
      `INSERT INTO energy_types (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );
    
    res.status(201).json({ message: 'Energy type created', energy_type: result.rows[0] });
  } catch (error) {
    console.error('Create energy type error:', error);
    res.status(500).json({ error: 'Failed to create energy type' });
  }
};

const updateEnergyType = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await query(
      `UPDATE energy_types 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name, description, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Energy type not found' });
    }
    
    res.json({ message: 'Energy type updated', energy_type: result.rows[0] });
  } catch (error) {
    console.error('Update energy type error:', error);
    res.status(500).json({ error: 'Failed to update energy type' });
  }
};

const deleteEnergyType = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM energy_types WHERE id = $1 AND is_system = false RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Energy type not found or cannot be deleted' });
    }
    
    res.json({ message: 'Energy type deleted successfully' });
  } catch (error) {
    console.error('Delete energy type error:', error);
    res.status(500).json({ error: 'Failed to delete energy type' });
  }
};

// Authorized Departments
const getAuthorizedDepartments = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM authorized_departments ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get authorized departments error:', error);
    res.status(500).json({ error: 'Failed to get authorized departments' });
  }
};

const getAuthorizedDepartmentById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM authorized_departments WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Authorized department not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get authorized department by ID error:', error);
    res.status(500).json({ error: 'Failed to get authorized department' });
  }
};

const createAuthorizedDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await query(
      `INSERT INTO authorized_departments (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );
    
    res.status(201).json({ message: 'Authorized department created', department: result.rows[0] });
  } catch (error) {
    console.error('Create authorized department error:', error);
    res.status(500).json({ error: 'Failed to create authorized department' });
  }
};

const updateAuthorizedDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const result = await query(
      `UPDATE authorized_departments 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [name, description, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Authorized department not found' });
    }
    
    res.json({ message: 'Authorized department updated', department: result.rows[0] });
  } catch (error) {
    console.error('Update authorized department error:', error);
    res.status(500).json({ error: 'Failed to update authorized department' });
  }
};

const deleteAuthorizedDepartment = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM authorized_departments WHERE id = $1 AND is_system = false RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Authorized department not found or cannot be deleted' });
    }
    
    res.json({ message: 'Authorized department deleted successfully' });
  } catch (error) {
    console.error('Delete authorized department error:', error);
    res.status(500).json({ error: 'Failed to delete authorized department' });
  }
};

// Maintenance Types
const getMaintenanceTypes = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM maintenance_types ORDER BY name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get maintenance types error:', error);
    res.status(500).json({ error: 'Failed to get maintenance types' });
  }
};

const getMaintenanceTypeById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM maintenance_types WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance type not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get maintenance type by ID error:', error);
    res.status(500).json({ error: 'Failed to get maintenance type' });
  }
};

const createMaintenanceType = async (req, res) => {
  try {
    const { name, description, is_periodic } = req.body;
    
    const result = await query(
      `INSERT INTO maintenance_types (name, description, is_periodic)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, is_periodic]
    );
    
    res.status(201).json({ message: 'Maintenance type created', maintenance_type: result.rows[0] });
  } catch (error) {
    console.error('Create maintenance type error:', error);
    res.status(500).json({ error: 'Failed to create maintenance type' });
  }
};

const updateMaintenanceType = async (req, res) => {
  try {
    const { name, description, is_periodic } = req.body;
    
    const result = await query(
      `UPDATE maintenance_types 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           is_periodic = COALESCE($3, is_periodic)
       WHERE id = $4
       RETURNING *`,
      [name, description, is_periodic, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance type not found' });
    }
    
    res.json({ message: 'Maintenance type updated', maintenance_type: result.rows[0] });
  } catch (error) {
    console.error('Update maintenance type error:', error);
    res.status(500).json({ error: 'Failed to update maintenance type' });
  }
};

const deleteMaintenanceType = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM maintenance_types WHERE id = $1 AND is_system = false RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Maintenance type not found or cannot be deleted' });
    }
    
    res.json({ message: 'Maintenance type deleted successfully' });
  } catch (error) {
    console.error('Delete maintenance type error:', error);
    res.status(500).json({ error: 'Failed to delete maintenance type' });
  }
};

module.exports = {
  getSystemSettings,
  updateSystemSetting,
  createSystemSetting,
  getAssetCategories,
  getAssetCategoryById,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  getMeasurementUnits,
  getMeasurementUnitById,
  createMeasurementUnit,
  updateMeasurementUnit,
  deleteMeasurementUnit,
  getEnergyTypes,
  getEnergyTypeById,
  createEnergyType,
  updateEnergyType,
  deleteEnergyType,
  getAuthorizedDepartments,
  getAuthorizedDepartmentById,
  createAuthorizedDepartment,
  updateAuthorizedDepartment,
  deleteAuthorizedDepartment,
  getMaintenanceTypes,
  getMaintenanceTypeById,
  createMaintenanceType,
  updateMaintenanceType,
  deleteMaintenanceType
};
