const { query } = require('../config/database');

const getAllAssets = async (req, res) => {
  try {
    const { facility_id, category_id, area_id, status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT a.*, 
             ac.name as category_name,
             ar.name as area_name,
             f.name as facility_name,
             mu.symbol as capacity_unit_symbol
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id = ac.id
      LEFT JOIN areas ar ON a.area_id = ar.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN measurement_units mu ON a.capacity_unit_id = mu.id
      WHERE a.is_active = true
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (facility_id) {
      queryText += ` AND a.facility_id = $${paramIndex}`;
      params.push(facility_id);
      paramIndex++;
    }
    
    if (category_id) {
      queryText += ` AND a.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }
    
    if (area_id) {
      queryText += ` AND a.area_id = $${paramIndex}`;
      params.push(area_id);
      paramIndex++;
    }
    
    if (status) {
      queryText += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (search) {
      queryText += ` AND (a.name ILIKE $${paramIndex} OR a.asset_code ILIKE $${paramIndex} OR a.brand ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    queryText += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    res.json({
      assets: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get all assets error:', error);
    res.status(500).json({ error: 'Failed to get assets' });
  }
};

const getAssetById = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, 
              ac.name as category_name,
              ar.name as area_name,
              f.name as facility_name,
              mu.symbol as capacity_unit_symbol,
              et.name as energy_type_name,
              ad.name as responsible_department_name,
              u.first_name || ' ' || u.last_name as responsible_user_name
       FROM assets a
       LEFT JOIN asset_categories ac ON a.category_id = ac.id
       LEFT JOIN areas ar ON a.area_id = ar.id
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN measurement_units mu ON a.capacity_unit_id = mu.id
       LEFT JOIN energy_types et ON a.energy_type_id = et.id
       LEFT JOIN authorized_departments ad ON a.responsible_department_id = ad.id
       LEFT JOIN users u ON a.responsible_user_id = u.id
       WHERE a.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get asset by ID error:', error);
    res.status(500).json({ error: 'Failed to get asset' });
  }
};

const createAsset = async (req, res) => {
  try {
    const {
      asset_code,
      name,
      description,
      category_id,
      area_id,
      facility_id,
      brand,
      model,
      serial_number,
      purchase_date,
      warranty_expiry_date,
      installation_date,
      capacity_value,
      capacity_unit_id,
      energy_type_id,
      power_consumption,
      status,
      condition,
      purchase_price,
      current_value,
      responsible_department_id,
      responsible_user_id,
      manufacturer,
      supplier,
      technical_specs
    } = req.body;
    
    const result = await query(
      `INSERT INTO assets (
        asset_code, name, description, category_id, area_id, facility_id,
        brand, model, serial_number, purchase_date, warranty_expiry_date,
        installation_date, capacity_value, capacity_unit_id, energy_type_id,
        power_consumption, status, condition, purchase_price, current_value,
        responsible_department_id, responsible_user_id, manufacturer, supplier,
        technical_specs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      RETURNING *`,
      [
        asset_code, name, description, category_id, area_id, facility_id,
        brand, model, serial_number, purchase_date, warranty_expiry_date,
        installation_date, capacity_value, capacity_unit_id, energy_type_id,
        power_consumption, status, condition, purchase_price, current_value,
        responsible_department_id, responsible_user_id, manufacturer, supplier,
        technical_specs ? JSON.stringify(technical_specs) : null
      ]
    );
    
    res.status(201).json({ message: 'Asset created successfully', asset: result.rows[0] });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

const updateAsset = async (req, res) => {
  try {
    const {
      asset_code,
      name,
      description,
      category_id,
      area_id,
      facility_id,
      brand,
      model,
      serial_number,
      purchase_date,
      warranty_expiry_date,
      installation_date,
      capacity_value,
      capacity_unit_id,
      energy_type_id,
      power_consumption,
      status,
      condition,
      purchase_price,
      current_value,
      responsible_department_id,
      responsible_user_id,
      manufacturer,
      supplier,
      technical_specs
    } = req.body;
    
    const result = await query(
      `UPDATE assets 
       SET asset_code = COALESCE($1, asset_code),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           category_id = COALESCE($4, category_id),
           area_id = COALESCE($5, area_id),
           facility_id = COALESCE($6, facility_id),
           brand = COALESCE($7, brand),
           model = COALESCE($8, model),
           serial_number = COALESCE($9, serial_number),
           purchase_date = COALESCE($10, purchase_date),
           warranty_expiry_date = COALESCE($11, warranty_expiry_date),
           installation_date = COALESCE($12, installation_date),
           capacity_value = COALESCE($13, capacity_value),
           capacity_unit_id = COALESCE($14, capacity_unit_id),
           energy_type_id = COALESCE($15, energy_type_id),
           power_consumption = COALESCE($16, power_consumption),
           status = COALESCE($17, status),
           condition = COALESCE($18, condition),
           purchase_price = COALESCE($19, purchase_price),
           current_value = COALESCE($20, current_value),
           responsible_department_id = COALESCE($21, responsible_department_id),
           responsible_user_id = COALESCE($22, responsible_user_id),
           manufacturer = COALESCE($23, manufacturer),
           supplier = COALESCE($24, supplier),
           technical_specs = COALESCE($25, technical_specs::jsonb),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $26
       RETURNING *`,
      [
        asset_code, name, description, category_id, area_id, facility_id,
        brand, model, serial_number, purchase_date, warranty_expiry_date,
        installation_date, capacity_value, capacity_unit_id, energy_type_id,
        power_consumption, status, condition, purchase_price, current_value,
        responsible_department_id, responsible_user_id, manufacturer, supplier,
        technical_specs ? JSON.stringify(technical_specs) : null,
        req.params.id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json({ message: 'Asset updated successfully', asset: result.rows[0] });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const result = await query(
      'UPDATE assets SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};

const getAssetsByFacility = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, ac.name as category_name, ar.name as area_name
       FROM assets a
       LEFT JOIN asset_categories ac ON a.category_id = ac.id
       LEFT JOIN areas ar ON a.area_id = ar.id
       WHERE a.facility_id = $1 AND a.is_active = true
       ORDER BY a.name ASC`,
      [req.params.facilityId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get assets by facility error:', error);
    res.status(500).json({ error: 'Failed to get assets' });
  }
};

const getAssetsByCategory = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, f.name as facility_name, ar.name as area_name
       FROM assets a
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN areas ar ON a.area_id = ar.id
       WHERE a.category_id = $1 AND a.is_active = true
       ORDER BY a.name ASC`,
      [req.params.categoryId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get assets by category error:', error);
    res.status(500).json({ error: 'Failed to get assets' });
  }
};

const getAssetsByArea = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, ac.name as category_name, f.name as facility_name
       FROM assets a
       LEFT JOIN asset_categories ac ON a.category_id = ac.id
       LEFT JOIN facilities f ON a.facility_id = f.id
       WHERE a.area_id = $1 AND a.is_active = true
       ORDER BY a.name ASC`,
      [req.params.areaId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get assets by area error:', error);
    res.status(500).json({ error: 'Failed to get assets' });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    // This would handle file uploads
    // For now, just return success
    res.json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
};

const getMaintenanceHistory = async (req, res) => {
  try {
    const result = await query(
      `SELECT mr.*, mt.name as maintenance_type_name,
              u.first_name || ' ' || u.last_name as performed_by_name
       FROM maintenance_records mr
       LEFT JOIN maintenance_types mt ON mr.maintenance_type_id = mt.id
       LEFT JOIN users u ON mr.performed_by = u.id
       WHERE mr.asset_id = $1
       ORDER BY mr.created_at DESC`,
      [req.params.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get maintenance history error:', error);
    res.status(500).json({ error: 'Failed to get maintenance history' });
  }
};

const getFaultHistory = async (req, res) => {
  try {
    const result = await query(
      `SELECT fr.*, u.first_name || ' ' || u.last_name as requested_by_name
       FROM fault_requests fr
       LEFT JOIN users u ON fr.requested_by = u.id
       WHERE fr.asset_id = $1
       ORDER BY fr.created_at DESC`,
      [req.params.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get fault history error:', error);
    res.status(500).json({ error: 'Failed to get fault history' });
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetsByFacility,
  getAssetsByCategory,
  getAssetsByArea,
  uploadDocuments,
  getMaintenanceHistory,
  getFaultHistory
};
