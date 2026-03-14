const { query } = require('../config/database');

const getAllAreaTypes = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM area_types ORDER BY category ASC, name ASC'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get all area types error:', error);
    res.status(500).json({ error: 'Failed to get area types' });
  }
};

const getAreaTypeById = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM area_types WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Area type not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get area type by ID error:', error);
    res.status(500).json({ error: 'Failed to get area type' });
  }
};

const createAreaType = async (req, res) => {
  try {
    const { name, category } = req.body;
    
    const result = await query(
      'INSERT INTO area_types (name, category) VALUES ($1, $2) RETURNING *',
      [name, category]
    );
    
    res.status(201).json({ message: 'Area type created successfully', area_type: result.rows[0] });
  } catch (error) {
    console.error('Create area type error:', error);
    res.status(500).json({ error: 'Failed to create area type' });
  }
};

const updateAreaType = async (req, res) => {
  try {
    const { name, category } = req.body;
    
    const result = await query(
      `UPDATE area_types 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category)
       WHERE id = $3
       RETURNING *`,
      [name, category, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Area type not found' });
    }
    
    res.json({ message: 'Area type updated successfully', area_type: result.rows[0] });
  } catch (error) {
    console.error('Update area type error:', error);
    res.status(500).json({ error: 'Failed to update area type' });
  }
};

const deleteAreaType = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM area_types WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Area type not found' });
    }
    
    res.json({ message: 'Area type deleted successfully' });
  } catch (error) {
    console.error('Delete area type error:', error);
    res.status(500).json({ error: 'Failed to delete area type' });
  }
};

const getAllAreas = async (req, res) => {
  try {
    const { facility_id, area_type_id, block_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT a.*, 
             at.name as area_type_name,
             at.category as area_type_category,
             f.name as facility_name,
             fb.block_name
      FROM areas a
      LEFT JOIN area_types at ON a.area_type_id = at.id
      LEFT JOIN facilities f ON a.facility_id = f.id
      LEFT JOIN facility_blocks fb ON a.block_id = fb.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (facility_id) {
      queryText += ` AND a.facility_id = $${paramIndex}`;
      params.push(facility_id);
      paramIndex++;
    }
    
    if (area_type_id) {
      queryText += ` AND a.area_type_id = $${paramIndex}`;
      params.push(area_type_id);
      paramIndex++;
    }
    
    if (block_id) {
      queryText += ` AND a.block_id = $${paramIndex}`;
      params.push(block_id);
      paramIndex++;
    }
    
    queryText += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    res.json({
      areas: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get all areas error:', error);
    res.status(500).json({ error: 'Failed to get areas' });
  }
};

const getAreaById = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, 
              at.name as area_type_name,
              at.category as area_type_category,
              f.name as facility_name,
              fb.block_name
       FROM areas a
       LEFT JOIN area_types at ON a.area_type_id = at.id
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN facility_blocks fb ON a.block_id = fb.id
       WHERE a.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Area not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get area by ID error:', error);
    res.status(500).json({ error: 'Failed to get area' });
  }
};

const createArea = async (req, res) => {
  try {
    const {
      facility_id,
      block_id,
      area_type_id,
      floor_number,
      area_name,
      area_code,
      area_size,
      description
    } = req.body;
    
    const result = await query(
      `INSERT INTO areas (
        facility_id, block_id, area_type_id, floor_number, area_name,
        area_code, area_size, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        facility_id, block_id, area_type_id, floor_number, area_name,
        area_code, area_size, description
      ]
    );
    
    res.status(201).json({ message: 'Area created successfully', area: result.rows[0] });
  } catch (error) {
    console.error('Create area error:', error);
    res.status(500).json({ error: 'Failed to create area' });
  }
};

const updateArea = async (req, res) => {
  try {
    const {
      facility_id,
      block_id,
      area_type_id,
      floor_number,
      area_name,
      area_code,
      area_size,
      description
    } = req.body;
    
    const result = await query(
      `UPDATE areas 
       SET facility_id = COALESCE($1, facility_id),
           block_id = COALESCE($2, block_id),
           area_type_id = COALESCE($3, area_type_id),
           floor_number = COALESCE($4, floor_number),
           area_name = COALESCE($5, area_name),
           area_code = COALESCE($6, area_code),
           area_size = COALESCE($7, area_size),
           description = COALESCE($8, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        facility_id, block_id, area_type_id, floor_number, area_name,
        area_code, area_size, description, req.params.id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Area not found' });
    }
    
    res.json({ message: 'Area updated successfully', area: result.rows[0] });
  } catch (error) {
    console.error('Update area error:', error);
    res.status(500).json({ error: 'Failed to update area' });
  }
};

const deleteArea = async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM areas WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Area not found' });
    }
    
    res.json({ message: 'Area deleted successfully' });
  } catch (error) {
    console.error('Delete area error:', error);
    res.status(500).json({ error: 'Failed to delete area' });
  }
};

const getAreasByFacility = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, 
              at.name as area_type_name,
              at.category as area_type_category,
              fb.block_name
       FROM areas a
       LEFT JOIN area_types at ON a.area_type_id = at.id
       LEFT JOIN facility_blocks fb ON a.block_id = fb.id
       WHERE a.facility_id = $1
       ORDER BY a.area_name ASC`,
      [req.params.facilityId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get areas by facility error:', error);
    res.status(500).json({ error: 'Failed to get areas' });
  }
};

const getAreasByBlock = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, 
              at.name as area_type_name,
              at.category as area_type_category,
              f.name as facility_name
       FROM areas a
       LEFT JOIN area_types at ON a.area_type_id = at.id
       LEFT JOIN facilities f ON a.facility_id = f.id
       WHERE a.block_id = $1
       ORDER BY a.area_name ASC`,
      [req.params.blockId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get areas by block error:', error);
    res.status(500).json({ error: 'Failed to get areas' });
  }
};

const getAreasByType = async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, 
              f.name as facility_name,
              fb.block_name
       FROM areas a
       LEFT JOIN facilities f ON a.facility_id = f.id
       LEFT JOIN facility_blocks fb ON a.block_id = fb.id
       WHERE a.area_type_id = $1
       ORDER BY a.area_name ASC`,
      [req.params.typeId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get areas by type error:', error);
    res.status(500).json({ error: 'Failed to get areas' });
  }
};

module.exports = {
  getAllAreaTypes,
  getAreaTypeById,
  createAreaType,
  updateAreaType,
  deleteAreaType,
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
  getAreasByFacility,
  getAreasByBlock,
  getAreasByType
};
