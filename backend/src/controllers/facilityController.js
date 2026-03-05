const { query } = require('../config/database');

const getAllFacilities = async (req, res) => {
  try {
    const { facility_type, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = 'SELECT * FROM facilities WHERE is_active = true';
    const params = [];
    let paramIndex = 1;
    
    if (facility_type) {
      queryText += ` AND facility_type = $${paramIndex}`;
      params.push(facility_type);
      paramIndex++;
    }
    
    if (search) {
      queryText += ` AND (name ILIKE $${paramIndex} OR short_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    queryText += ` ORDER BY name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM facilities WHERE is_active = true';
    const countParams = [];
    let countParamIndex = 1;
    
    if (facility_type) {
      countQuery += ` AND facility_type = $${countParamIndex}`;
      countParams.push(facility_type);
      countParamIndex++;
    }
    
    if (search) {
      countQuery += ` AND (name ILIKE $${countParamIndex} OR short_name ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    const countResult = await query(countQuery, countParams);
    
    res.json({
      facilities: result.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    });
  } catch (error) {
    console.error('Get all facilities error:', error);
    res.status(500).json({ error: 'Failed to get facilities' });
  }
};

const getFacilityById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM facilities WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get facility by ID error:', error);
    res.status(500).json({ error: 'Failed to get facility' });
  }
};

const createFacility = async (req, res) => {
  try {
    const {
      facility_code,
      name,
      short_name,
      facility_type,
      address,
      city,
      district,
      website,
      phone,
      email,
      trade_name,
      sgk_registration_number,
      nace_code,
      workplace_hazard_class,
      block_count,
      building_construction_year,
      building_height,
      structure_height,
      floor_count,
      closed_area,
      closed_parking_area,
      bed_count,
      employee_count,
      contractor_employee_count,
      facility_manager_id
    } = req.body;
    
    const result = await query(
      `INSERT INTO facilities (
        facility_code, name, short_name, facility_type, address, city, district,
        website, phone, email, trade_name, sgk_registration_number, nace_code,
        workplace_hazard_class, block_count, building_construction_year, building_height,
        structure_height, floor_count, closed_area, closed_parking_area, bed_count,
        employee_count, contractor_employee_count, facility_manager_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      RETURNING *`,
      [
        facility_code, name, short_name, facility_type, address, city, district,
        website, phone, email, trade_name, sgk_registration_number, nace_code,
        workplace_hazard_class, block_count, building_construction_year, building_height,
        structure_height, floor_count, closed_area, closed_parking_area, bed_count,
        employee_count, contractor_employee_count, facility_manager_id
      ]
    );
    
    res.status(201).json({ message: 'Facility created successfully', facility: result.rows[0] });
  } catch (error) {
    console.error('Create facility error:', error);
    res.status(500).json({ error: 'Failed to create facility' });
  }
};

const updateFacility = async (req, res) => {
  try {
    const {
      facility_code,
      name,
      short_name,
      facility_type,
      address,
      city,
      district,
      website,
      phone,
      email,
      trade_name,
      sgk_registration_number,
      nace_code,
      workplace_hazard_class,
      block_count,
      building_construction_year,
      building_height,
      structure_height,
      floor_count,
      closed_area,
      closed_parking_area,
      bed_count,
      employee_count,
      contractor_employee_count,
      facility_manager_id
    } = req.body;
    
    const result = await query(
      `UPDATE facilities 
       SET facility_code = COALESCE($1, facility_code),
           name = COALESCE($2, name),
           short_name = COALESCE($3, short_name),
           facility_type = COALESCE($4, facility_type),
           address = COALESCE($5, address),
           city = COALESCE($6, city),
           district = COALESCE($7, district),
           website = COALESCE($8, website),
           phone = COALESCE($9, phone),
           email = COALESCE($10, email),
           trade_name = COALESCE($11, trade_name),
           sgk_registration_number = COALESCE($12, sgk_registration_number),
           nace_code = COALESCE($13, nace_code),
           workplace_hazard_class = COALESCE($14, workplace_hazard_class),
           block_count = COALESCE($15, block_count),
           building_construction_year = COALESCE($16, building_construction_year),
           building_height = COALESCE($17, building_height),
           structure_height = COALESCE($18, structure_height),
           floor_count = COALESCE($19, floor_count),
           closed_area = COALESCE($20, closed_area),
           closed_parking_area = COALESCE($21, closed_parking_area),
           bed_count = COALESCE($22, bed_count),
           employee_count = COALESCE($23, employee_count),
           contractor_employee_count = COALESCE($24, contractor_employee_count),
           facility_manager_id = COALESCE($25, facility_manager_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $26
       RETURNING *`,
      [
        facility_code, name, short_name, facility_type, address, city, district,
        website, phone, email, trade_name, sgk_registration_number, nace_code,
        workplace_hazard_class, block_count, building_construction_year, building_height,
        structure_height, floor_count, closed_area, closed_parking_area, bed_count,
        employee_count, contractor_employee_count, facility_manager_id,
        req.params.id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    res.json({ message: 'Facility updated successfully', facility: result.rows[0] });
  } catch (error) {
    console.error('Update facility error:', error);
    res.status(500).json({ error: 'Failed to update facility' });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const result = await query(
      'UPDATE facilities SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Delete facility error:', error);
    res.status(500).json({ error: 'Failed to delete facility' });
  }
};

const getFacilityBlocks = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM facility_blocks WHERE facility_id = $1 ORDER BY block_number ASC',
      [req.params.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get facility blocks error:', error);
    res.status(500).json({ error: 'Failed to get facility blocks' });
  }
};

const addBlock = async (req, res) => {
  try {
    const { block_name, block_number } = req.body;
    
    const result = await query(
      'INSERT INTO facility_blocks (facility_id, block_name, block_number) VALUES ($1, $2, $3) RETURNING *',
      [req.params.id, block_name, block_number]
    );
    
    res.status(201).json({ message: 'Block added successfully', block: result.rows[0] });
  } catch (error) {
    console.error('Add block error:', error);
    res.status(500).json({ error: 'Failed to add block' });
  }
};

const updateBlock = async (req, res) => {
  try {
    const { block_name, block_number } = req.body;
    
    const result = await query(
      `UPDATE facility_blocks 
       SET block_name = COALESCE($1, block_name),
           block_number = COALESCE($2, block_number)
       WHERE id = $3
       RETURNING *`,
      [block_name, block_number, req.params.blockId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }
    
    res.json({ message: 'Block updated successfully', block: result.rows[0] });
  } catch (error) {
    console.error('Update block error:', error);
    res.status(500).json({ error: 'Failed to update block' });
  }
};

const deleteBlock = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM facility_blocks WHERE id = $1 RETURNING id',
      [req.params.blockId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Block not found' });
    }
    
    res.json({ message: 'Block deleted successfully' });
  } catch (error) {
    console.error('Delete block error:', error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
};

const getFacilityStatistics = async (req, res) => {
  try {
    const facilityId = req.params.id;
    
    // Get asset count
    const assetResult = await query(
      'SELECT COUNT(*) as count FROM assets WHERE facility_id = $1 AND is_active = true',
      [facilityId]
    );
    
    // Get maintenance records count
    const maintenanceResult = await query(
      'SELECT COUNT(*) as count FROM maintenance_records mr JOIN maintenance_plans mp ON mr.maintenance_plan_id = mp.id WHERE mp.facility_id = $1',
      [facilityId]
    );
    
    // Get fault requests count
    const faultResult = await query(
      'SELECT COUNT(*) as count FROM fault_requests WHERE facility_id = $1',
      [facilityId]
    );
    
    // Get areas count
    const areaResult = await query(
      'SELECT COUNT(*) as count FROM areas WHERE facility_id = $1',
      [facilityId]
    );
    
    res.json({
      assets: parseInt(assetResult.rows[0].count),
      maintenance_records: parseInt(maintenanceResult.rows[0].count),
      fault_requests: parseInt(faultResult.rows[0].count),
      areas: parseInt(areaResult.rows[0].count)
    });
  } catch (error) {
    console.error('Get facility statistics error:', error);
    res.status(500).json({ error: 'Failed to get facility statistics' });
  }
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilityBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  getFacilityStatistics
};
